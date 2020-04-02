<template>
  <div class="example">
    <Table
      @selection-change="handleSelection"
      selectable
      :data="[
      { name: '张三，法外狂徒张三', nickName: '三三', age: '23', birthday: '1993' },
      { name: '李四', nickName: '四四', age: '32', birthday: '1992' },
      { name: '王五', nickName: '五五', age: '12', birthday: '1998' },
      { name: '赵六', nickName: '六六', age: '15', birthday: '1990' },
     ]"
    >
      <table-column prop="name" label="名字"></table-column>
      <table-column prop="nickName" label="小名" sortable></table-column>
      <table-column prop="age" label="年龄" dataType="numeric" sortable></table-column>
      <table-column prop="birthday" label="生日" sortable></table-column>
      <table-column label="操作" :filterable="false">
        <template slot-scope="row">
          <!-- <a :href="`#${row.name}`">编辑</a> -->
          {{row.name}}
        </template>
      </table-column>
      <!-- <column-example prop="b" /> -->
    </Table>
    <div class="desc">
      属性说明：
      <div class="row" v-for="(item, index) in exampleData" :key="index">{{item}}</div>
    </div>
    <div class="selection">
      选中行Selection
      {{ selectionRows }}
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
        'table-column: prop、label、hidden、sortable、dataType、cellClass、headerClass、formatter、sortBy',
        'toggleRowSelection、clearSelection'
      ]
    }
  },
  methods: {
    handleSelection (selection) {
      // 有bug
      // this.selectionRows = selection
      console.log(selection, 'example')
    }
  }
}
</script>
