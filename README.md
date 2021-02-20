# YiTable

## Installation

```sh
$ npm i yi-table -S
```
Next, you must register the component. The most common use case is to do that globally.

```js
import YiTable from 'yi-table';

Vue.use(YiTable);
```

## Usage

example

```html
<yi-table
  :data="[
    { name: '张三，法外狂徒张三', age: '23', birthday: '1993' },
    { name: '李四', age: '32', birthday: '1992' },
    { name: '王五', age: '12', birthday: '1998' },
    { name: '赵六', age: '15', birthday: '1990' }
  ]"
>
  <yi-table-column type="index"></yi-table-column>
  <yi-table-column type="selection" :selectable="handleSelectable"></yi-table-column>
  <yi-table-column prop="name" label="姓名"></yi-table-column>
  <yi-table-column prop="age" label="年龄" sortable></yi-table-column>
  <yi-table-column prop="birthday" label="生日"></yi-table-column>
</yi-table>
```

### Table Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| data | 显示的数据 | array | — | — |
| show-option | 是否有表格外右上角的筛选框和显示列配置图标 | boolean | — | true |
| show-filter | 是否表头下方列（点击过滤按钮时的出现的列） | boolean | — | true |
| show-columns | 待展示的列，接受每一列的prop，无prop则默认显示 | array | — | — |
| inside | 表格内最后一列展示还是表格外展示右上角的筛选框和显示列配置图标 | boolean | — | false |
| show-header | 是否有表头 | boolean | — | true |
| cache-key | 表格的key，用来存储表格的显示列，根据业务定，key唯一，存于localStorage | String | — | null |
| cache | 是否启用表格的cache-key，需要设置 cache-key 属性才能使用 | Boolean | — | true |
| table-cache-name | 表格的cache-key在 localStorage 中的名称，包含各个表格的cache-key | String | — | YITABLE |
| highlight-current-row | 是否要高亮当前行 | boolean | — | false |
|  sort-by | `prop`指定默认的排序的列 | String | — | — |
|  sort-order | 指定默认排序的顺序 | String | 	`order`: asc, desc	 | — |
| row-class-name | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。 | Function({row, rowIndex})/String | — | — |
| stripe | 是否为斑马纹 table | boolean | — | true |
| border | 是否带有纵向边框 | boolean | — | true |
| align | 表格列的对齐方式 | String | left/center/right | center |
| i18n | 表格国际化 | String | zh/en | zh |
| table-class| 表格自定义类名 | Function | — | — |
| thead-class| 表格的表头自定义类名 | Function | — | — |
| tbody-class| 表格的body自定义类名 | Function | — | — |

### Table Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| current-change | 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性 | currentRow, oldCurrentRow |
| row-click | 当某一行被点击时会触发该事件 | row, column, event |
| select-all | 当用户手动勾选全选 Checkbox 时触发的事件 | selection |
| selection-change | 当选择项发生变化时会触发该事件，选中列变化，type是selection时候生效 | selection |
| column-props | 表格中有prop的列，用于隐藏列，返回{prop,label} | {prop,label} |
| filter | 是否已经展开筛选框 | Boolean |

### Table Methods
| 方法名 | 说明 | 参数 |
| ---- | ---- | ---- |
| clearSelection | 用于多选表格，清空用户的选择 | — |
| toggleRowSelection | 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中） | row, selected |
| toggleAllSelection | 用于多选表格，切换所有行的选中状态 | - |
| setCurrentRow | 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。 | row |

### Table Slot
| name | 说明 |
|------|--------|
| empty-text | 表格为空时，表格body显示文案默认为`暂无数据`（`No Data`） |
| filter-icon | 筛选图标slot |
| option-icon | 列配置图标slot |

### Table-column Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| type | 对应列的类型。如果设置了 `selection` 则显示多选框；如果设置了 `index` 则显示该行的索引（从 1 开始计算）； | string | selection/index | — |
| index | 如果设置了 `type=index`，可以通过传递 `index` 属性来自定义索引 | number, Function(index) | - | - |
| label | 显示的标题 | string | — | — |
| prop | 对应列内容的字段名，也可以使用 property 属性 | string | — | — |
| width | 对应列的宽度（注：type为`index`时，默认宽度为55px） | string | — | — |
| min-width | 对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 | string | — | — |
| hidden | 是否显示对应列 | boolean | false | — |
| formatter | 用来格式化内容 | Function(row, column, cellValue, index) | — | — |
| align | 对齐方式 | String | left/center/right | center |
| selectable | 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选 | Function(row, index) | — | — |
| sortable | 对应列是否可以排序 | boolean | true/false | false |
| data-type | 指定数据按照哪个属性进行排序，如果设置为 'numeric'或者'date'则按数字大小来排序，不设置的话默认按照`localeCompare`方法来排序(排序方式，取决于`sortOrder`的值是否为`desc`来升降序) | — | — |

### 举例

```html
<template>
  <div class="example">
    <div class="item table">
      <Table
        :showFilter="showFilte"
        :showColumns="currentColumns"
        highlight-current-row
        align="left"
        ref="yitable"
        :i18n="languageI18n ? 'zh' : 'en'"
        cacheKey="testTable"
        :row-class-name="rowClassName"
        @selection-change="handleSelection"
        :data="viewData"
      >
        <div slot="name"><input type="text" v-model="queryName"></div>
        <table-column prop="index" type="index" label="序号"></table-column>
        <table-column prop="selection" type="selection" width="55" :selectable="handleSelectable"></table-column>
        <table-column prop="name" label="名字" width="100" :hidden="isHiddenName"></table-column>
        <table-column prop="nickName" label="小名" sortable></table-column>
        <table-column prop="age" label="年龄" data-type="numeric" sortable></table-column>
        <table-column prop="birthday" label="生日" sortable></table-column>
        <table-column
          label="操作"
          :filterable="false"
          align="right"
          cellClass="cell-test"
        >
        </table-column>
      </Table>
    </div>
  </div>
</template>

<script>
import Table from './Table.vue'
import TableColumn from './TableColumn.vue'

export default {
  components: {
    Table,
    TableColumn
  },
  data () {
    return {
      queryName: '',
      isShow: false,
      showFilte: false,
      isHiddenName: false,
      languageI18n: false,
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
      ]
    }
  },
  computed: {
    viewData () {
      let subList = this.mockData
      let l = s => s.toLowerCase() // 转换为小写的方法简化
      let key = l(this.queryName) // 搜索词转为小写
      subList = subList.filter(member => l(member.name).indexOf(key) > -1)
      return subList
    }
  },
  methods: {
    toggleLanguage () {
      console.log('toggleLanguage')
      this.languageI18n = !this.languageI18n
    },
    highLightRow () {
      this.$refs.yitable.setCurrentRow(this.mockData[3])
    },
    handleSelection (selection) {
      // 有bug
      this.selectionRows = selection
      console.log(selection, selection.length, 'example')
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
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.yitable.toggleRowSelection(row)
        })
      } else {
        this.$refs.yitable.clearSelection()
      }
    },
    toggleAllSelection () {
      this.$refs.yitable.toggleAllSelection()
    },
    rowClassName ({ row, index }) {
      if (index === 2) {
        console.log(row, 'rowClassName')
        return 'test-row'
      }
    },
    switchShowColumn () {
      this.isHiddenName = !this.isHiddenName
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
  .test-row {
    background-color: oldlace;
  }
}
</style>

```

## TODO

- [x] 详细文档
- [x] `table 属性`row-class-name
- [ ] `table-column 属性`show-overflow-tooltip
- [x] `table的内部方法，通过ref引用`toggleRowSelection
- [x]  默认type为index和selection的列宽度为55
- [x]  `table-column`的`slot-scope="scope"`, 可以不需要给（应该是prop不需要给，不给的默认处理为空）
- [x] `table的border和stripe属性默认为**true**`
- [x] `多选框样式统一成element-ui样式`
- [ ] `待修复，scroll滚动条样式固定`
- [ ] `待优化，过滤时，is-table-filter-show处的高度，应该优化成自动处理，而不是写死`
- [ ] `待修复，表格斑马纹颜色优先级过高，应该依赖外部`
- [ ] `待修复，表格在模态框内，popover展示时，z-index应该要提高优先级，（注：直接给999999？）`
- [ ] `待优化，table 暂无数据上面加一个border,表格最顶加一个border，表格底部加一个border`

- [ ] `打包方式修改为Rollupjs`
- [ ] `vue3 + typeScript`

## <span id="git-commit">Git Commit Guidelines</span> [↑Top](#top)

### Type

Must be one of the following:([detail](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md))

+ feat: A new feature
+ fix: A bug fix
+ docs: Documentation only changes
+ style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
+ refactor: A code change that neither fixes a bug nor adds a feature
+ perf: A code change that improves performance
+ test: Adding missing or correcting existing tests
+ chore: Changes to the build process or auxiliary tools and libraries such as documentation generation


## publish

> Merge branch dev in test

> git checkout test

> npm version <major/minor/patch>

```sh
$ npm run lib
```

```sh
$ npm publish
```

`note: publish **.umd.min.js`

## Local Development

> git checkout dev

> npm start
