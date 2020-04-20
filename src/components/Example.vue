<template>
  <div class="example">
    <div class="item table">
      <button>我是一些其他地方的按钮</button>
      <Table
        :showFilter="showFilte"
        :showColumns="currentColumns"
        border
        stripe
        highlight-current-row
        align="left"
        ref="yitable"
        @selection-change="handleSelection"
        :data="isOriginalData ? mockData : dataList"
      >
        <!-- <span slot="filter-icon">筛选slot</span>
        <span slot="option-icon">过滤slot</span> -->
        <div slot="name">名字搜索</div>
        <table-column prop="index" type="index" label="序号"></table-column>
        <table-column prop="selection" type="selection" width="55" :selectable="handleSelectable"></table-column>
        <table-column prop="name" label="名字" width="100" :hidden="isHiddenName"></table-column>
        <table-column prop="nickName" label="小名" sortable></table-column>
        <table-column prop="age" label="年龄" data-type="numeric" sortable></table-column>
        <table-column prop="birthday" label="生日" sortable></table-column>
        <table-column
          label="操作"
          prop="operate"
          :filterable="false"
          align="right"
          cellClass="cell-test"
        >
          <template slot-scope="scope">{{scope.row.name}}</template>
        </table-column>
        <!-- <column-example prop="b" /> -->
      </Table>
    </div>
    <div class="item info">
      <div class="desc">
        <div class="title">属性说明：</div>
        <div class="row" v-for="(item, index) in exampleData" :key="index">{{item}}</div>
      </div>
      <div class="selection">
        <div class="title">选中行Selection：</div>
        {{ selectionRows }}
      </div>
      <div class="opt">
        <div class="title">操作：</div>
        <button @click="switchFilter">展示过滤</button>
      </div>
      <div class="opt">
        <div class="title">数据操作：</div>
        <input type="checkbox" v-model="isOriginalData" />
        <button @click="deleteData" :disabled="isOriginalData">删除数据</button>
        <button @click="copyData" :disabled="isOriginalData">展示数据</button>
      </div>
      <div class="opt">
        <div class="title">列表隐藏操作：</div>
        <button @click="deleteHiddenData">显示某列</button>
        <button @click="recoveryData">列表还原</button>
        <div>当前列：{{currentColumns}}</div>
        <div>原有列：{{mockHiddenData}}</div>
      </div>
      <div class="opt">
        <div class="title">高亮某行</div>
        <button @click="highLightRow">高亮某行</button>
      </div>
    </div>
  </div>
</template>

<script>
import Table from './Table.vue'
import TableColumn from './TableColumn.vue'
// import ColumnExample from './ColumnExample.vue'

export default {
  components: {
    Table,
    TableColumn
  },
  data () {
    return {
      showFilte: false,
      isOriginalData: true,
      isHiddenName: false,
      maxHeight: '',
      selectionRows: [],
      dataList: [],
      mockHiddenData: ['name', 'nickName', 'age', 'birthday', 'operate'],
      currentColumns: [],
      mockData: [
        { name: '张三，法外狂徒张三', nickName: '三三', age: '23', birthday: '1993' },
        { name: '李四', nickName: '四四', age: '32', birthday: '1992' },
        { name: '王五', nickName: '五五', age: '12', birthday: '1998' },
        { name: '赵六', nickName: '六六', age: '15', birthday: '1990' },
        { name: '七', nickName: '七七', age: '27', birthday: '2003' },
        { name: '八', nickName: '八八', age: '82', birthday: '2001' },
        { name: '九', nickName: '九九', age: '29', birthday: '2008' },
        { name: '十', nickName: '十十', age: '10', birthday: '2010' },
        { name: '十二', nickName: '十二十二', age: '1212', birthday: '91' },
        { name: '十三', nickName: '十五十五', age: '-1', birthday: '2118' },
        { name: '十四', nickName: '十', age: '-4', birthday: '2118' }
      ],
      exampleData: [
        'data：显示的数据；',
        'label：显示的标题；',
        'sortable：（true/false）该列是否可排序，默认根据localeCompare来排序，特殊见dataType,注意：type="index"时，dataType不起作用，默认是数字排序',
        'dataType：（numeric/date）sortable为true时，numberic和date值根据数值大小排序',
        'prop：对应列内容的字段名，也可以使用 property 属性；',
        'formatter：它用于格式化指定列的值，接受一个Function，会传入两个参数：row和column；',
        'showColumns：待展示的列，接受每一列的prop，无prop则默认显示',
        '-----',
        'table：data、sortBy、sortOrder、tableClass、theadClass、tbodyClass、show-header、showColumns（Array）, slot="empty-text"，cache(Boolean)：是否缓存表格的列配置，默认开启，会根据URL来配置，cacheKey：除了根据pathname来配置以外还可以添加key，为了实现同URL多个TABLE,showOption(Boolean)配置表格，默认为显示',
        'table-column：prop、label、hidden、sortable、dataType、cellClass、headerClass、formatter、sortBy、width、min-width',
        'toggleRowSelection、clearSelection',
        '-----',
        'slot: filter-icon(筛选图标slot),option-icon(列配置图标）',
        'Events: current-change（选中的某一行）、row-click、select-all（全选）、column-props（表格中有prop的列，用于隐藏列，返回{prop,label}，这个应该封装在表格中）、selection-change（选中列变化，type是selection时候生效）'
      ]
    }
  },
  methods: {
    highLightRow () {
      this.$refs.yitable.setCurrentRow(this.mockData[3])
    },
    handleSelection (selection) {
      // 有bug
      this.selectionRows = selection
      console.log(selection, 'example')
    },
    deleteData () {
      this.dataList = this.mockData.slice(0, 4)
    },
    copyData () {
      this.dataList = this.mockData
    },
    deleteHiddenData () {
      this.currentColumns = this.mockHiddenData.slice(0, 3)
    },
    recoveryData () {
      this.currentColumns = this.mockHiddenData
    },
    switchFilter () {
      this.showFilte = !this.showFilte
    },
    handleSelectable (row, index) {
      if (index === 3) {
        return false
      } else {
        return true
      }
    },
    switchShowColumn () {
      this.isHiddenName = !this.isHiddenName
      console.log(this.isHiddenName)
    }
  }
}
</script>
<style lang="scss">
.example {
  display: flex;
  flex-direction: row;
  .item {
    flex: 1;
  }
  .table {
    flex: 1;
    height: 400px;
  }
}
.title {
  font-size: 18px;
  font-weight: 800;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
