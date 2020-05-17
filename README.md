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
  stripe
  border
>
  <yi-table-column type="index"></yi-table-column>
  <yi-table-column type="selection" :selectable="handleSelectable"></yi-table-column>
  <yi-table-column prop="name" label="姓名"></yi-table-column>
  <yi-table-column prop="age" label="年龄" sortable></yi-table-column>
  <yi-table-column prop="birthday" label="生日"></yi-table-column>
</yi-table>
```
## TODO

- [ ] 详细文档
- [x] `table 属性`row-class-name
- [ ] `table-column 属性`show-overflow-tooltip
- [x] `table的内部方法，通过ref引用`toggleRowSelection
- [x]  默认type为index和selection的列宽度为55
- [x]  `table-column`的`slot-scope="scope"`, 可以不需要给（应该是prop不需要给，不给的默认处理为空）
- [x] `table的border和stripe属性默认为**true**`
- [x] `多选框样式统一成element-ui样式`
- [ ] `scroll滚动条样式固定`

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
