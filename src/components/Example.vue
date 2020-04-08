<template>
  <div class="example">
    <div class="table">
      <Table
        border
        stripe
        @selection-change="handleSelection"
        :filterable="filterable"
        :data="[
        { name: '张三，法外狂徒张三', nickName: '三三', age: '23', birthday: '1993' },
        { name: '李四', nickName: '四四', age: '32', birthday: '1992' }
      ]"
      >
        <!-- { name: '王五', nickName: '五五', age: '12', birthday: '1998' },
        { name: '赵六', nickName: '六六', age: '15', birthday: '1990' },
        { name: '七', nickName: '七七', age: '27', birthday: '2003' },
        { name: '八', nickName: '八八', age: '82', birthday: '2001' },
        { name: '九', nickName: '九九', age: '29', birthday: '2008' },
        { name: '十', nickName: '十十', age: '10', birthday: '2010' },
        { name: '十二', nickName: '十二十二', age: '1212', birthday: '91' },
        { name: '十三', nickName: '十五十五', age: '-1', birthday: '2118' },
        { name: '十四', nickName: '十', age: '-4', birthday: '2118' } -->
        <!-- <div slot="nickName">名字搜索</div> -->
        <table-column type="index" width="55" label="序号" sortable></table-column>
        <table-column type="selection" width="55"></table-column>
        <table-column prop="name" label="名字" width="100"></table-column>
        <table-column prop="nickName" label="小名" sortable></table-column>
        <table-column prop="age" label="年龄" data-type="numeric" sortable></table-column>
        <table-column prop="birthday" label="生日" sortable></table-column>
        <table-column label="操作" :filterable="false">
          <template slot-scope="row">{{row.name}}</template>
        </table-column>
        <!-- <column-example prop="b" /> -->
      </Table>
    </div>
    <div class="info">
      <div class="desc">
        <span class="title">属性说明：</span>
        <div class="row" v-for="(item, index) in exampleData" :key="index">{{item}}</div>
      </div>
      <div class="selection">
        <span class="title">选中行Selection：</span>
        {{ selectionRows }}
      </div>
      <div class="opt">
        <span class="title">操作：</span>
        <button @click="switchFilter">展示过滤</button>
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
      filterable: false,
      selectionRows: [],
      exampleData: [
        'data：显示的数据；',
        'label：显示的标题；',
        'sortable：（true/false）该列是否可排序，默认根据localeCompare来排序，特殊见dataType',
        'dataType：（numeric/date）sortable为true时，numberic和date值根据数值大小排序',
        'prop：对应列内容的字段名，也可以使用 property 属性；',
        'formatter：它用于格式化指定列的值，接受一个Function，会传入两个参数：row和column；',
        '-----',
        'table：data、sortBy、sortOrder、emptyText、tableClass、theadClass、tbodyClass',
        'table-column: prop、label、hidden、sortable、dataType、cellClass、headerClass、formatter、sortBy、width、min-width',
        'toggleRowSelection、clearSelection'
      ]
    }
  },
  methods: {
    handleSelection (selection) {
      // 有bug
      // this.selectionRows = selection
      console.log(selection, 'example')
    },
    switchFilter () {
      this.filterable = !this.filterable
    }
  }
}
</script>
<style>
.example {
  display: flex;
  flex-direction: row;
}
.title {
  font-size: 18px;
  font-weight: 800;
}
</style>
