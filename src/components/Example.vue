<template>
  <div class="example">
    <Table
      :data="[
      { name: '张三', nickName: '三三', age: '23', birthday: '1993' },
      { name: '李四', nickName: '四四', age: '32', birthday: '1992' },
      { name: '王五', nickName: '五五', age: '12', birthday: '1998' },
      { name: '赵六', nickName: '六六', age: '15', birthday: '1990' },
     ]"
      sort-by="age"
      sort-order="asc"
    >
      <table-column prop="name" label="名字"></table-column>
      <table-column prop="nickName" label="小名"></table-column>
      <table-column prop="age" label="年龄" data-type="numeric"></table-column>
      <table-column prop="birthday" label="生日"></table-column>
      <table-column label="操作" :sortable="false" :filterable="false">
        <template slot-scope="row">
          <!-- <a :href="`#${row.name}`">编辑</a> -->
          {{row.name}}
        </template>
      </table-column>
      <column-example prop="b" />
    </Table>
    <div class="desc">
      属性说明：
      <div class="row" v-for="(item, index) in exampleData" :key="index">{{item}}</div>
    </div>
  </div>
</template>

<script>
import Table from './Table.vue'
import TableColumn from './TableColumn.vue'
import ColumnExample from './ColumnExample.vue'

export default {
  components: { Table, TableColumn, ColumnExample },
  data () {
    return {
      exampleData: [
        'data：显示的数据；',
        'prop：对应列内容的字段名，也可以使用 property 属性；',
        'formatter：它用于格式化指定列的值，接受一个Function，会传入两个参数：row和column；',
        'label：显示的标题；'
      ]
    }
  }
}
</script>
