<template>
  <div class="yi-checkbox">
    <label
      :class="['yi-checkbox', { 'is-checked': isChecked }, { 'is-indeterminate': indeterminate }, { 'is-disabled': disabled }]"
      :id="id"
    >
      <span
        :class="['yi-checkbox__input', { 'is-checked': isChecked }, { 'is-indeterminate': indeterminate }, { 'is-disabled': disabled }]"
        :tabindex="indeterminate ? 0 : false"
        :role="indeterminate ? 'checkbox' : false"
        :aria-checked="indeterminate ? 'mixed' : false"
      >
        <span class="yi-checkbox__inner"></span>
        <input
          class="yi-checkbox__original"
          type="checkbox"
          v-model="inputModel"
          :aria-hidden="indeterminate ? 'true' : 'false'"
          :disabled="disabled"
          :value="label"
          @change="handleChange"
          @click.stop="$emit('click')"
          @focus="focus = true"
          @blur="focus = false"
        />
      </span>
      <span class="yi-checkbox__label" v-if="$slots.default || label">
        <slot></slot>
        <template v-if="!$slots.default">{{label}}</template>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'YiCheckbox',
  props: {
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
    controls: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
  },
  data () {
    return {
      focus: false,
      selfModel: false
    }
  },
  computed: {
    inputModel: {
      get () {
        return this.value !== undefined ? this.value : this.selfModel
      },
      set (val) {
        this.$emit('input', val)
        this.selfModel = val
      }
    },
    isChecked () {
      return this.value !== undefined ? this.value : this.checked
    }
  },
  methods: {
    handleChange (v) {
      this.$emit('change', v)
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-primary: #409eff;
$--border-color-base: #dcdfe6;
$--color-text-placeholder: #c0c4cc;
$--border-color-extra-light: #f2f6fc;
$--index-normal: 1;

$--checkbox-font-color: #606266;
$--checkbox-font-weight: 500;
$--font-size-base: 14px;
$--checkbox-border-radius: 2px;
$--checkbox-input-width: 14px;
$--checkbox-input-height: 14px;
$--checkbox-background-color: #ffffff;
$--checkbox-input-border-color-hover: #409eff;
$--checkbox-checked-icon-color: #ffffff;
$--checkbox-checked-background-color: $--color-primary;

$--checkbox-checked-input-border-color: $--color-primary;
$--checkbox-checked-font-color: $--color-primary;

$--checkbox-disabled-input-fill: #edf2fc;
$--checkbox-disabled-border-color: $--border-color-base;

$--checkbox-disabled-icon-color: $--color-text-placeholder;

$--checkbox-disabled-checked-input-fill: $--border-color-extra-light;
$--checkbox-disabled-checked-input-border-color: $--border-color-base;
$--checkbox-disabled-checked-icon-color: $--color-text-placeholder;

$--disabled-color-base: $--color-text-placeholder;

.yi-checkbox {
  color: $--checkbox-font-color;
  font-weight: $--checkbox-font-weight;
  font-size: $--font-size-base;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  margin-right: 0px;
  .yi-checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    .yi-checkbox__inner {
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: $--checkbox-border-radius;
      box-sizing: border-box;
      width: $--checkbox-input-width;
      height: $--checkbox-input-height;
      background-color: $--checkbox-background-color;
      z-index: $--index-normal;
      transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
        background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);

      &:hover {
        border-color: $--checkbox-input-border-color-hover;
      }

      &::after {
        box-sizing: content-box;
        content: "";
        border: 1px solid $--checkbox-checked-icon-color;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        transition: transform 0.15s ease-in 0.05s;
        transform-origin: center;
      }
    }
  }
  .is-checked {
    .yi-checkbox__inner {
      background-color: $--checkbox-checked-background-color;
      border-color: $--checkbox-checked-input-border-color;

      &::after {
        transform: rotate(45deg) scaleY(1);
      }
    }

    & + .yi-checkbox__label {
      color: $--checkbox-checked-font-color;
    }
  }
  .is-indeterminate {
    .yi-checkbox__inner {
      background-color: $--checkbox-checked-background-color;
      border-color: $--checkbox-checked-input-border-color;

      &::before {
        content: "";
        position: absolute;
        display: block;
        background-color: $--checkbox-checked-icon-color;
        height: 2px;
        transform: scale(0.5);
        left: 0;
        right: 0;
        top: 5px;
      }

      &::after {
        display: none;
      }
    }
  }
  .is-disabled {
    .yi-checkbox__inner {
      background-color: $--checkbox-disabled-input-fill;
      border-color: $--checkbox-disabled-border-color;
      cursor: not-allowed;

      &::after {
        cursor: not-allowed;
        border-color: $--checkbox-disabled-icon-color;
      }

      & + .yi-checkbox__label {
        cursor: not-allowed;
      }
    }

    &.is-checked {
      .yi-checkbox__inner {
        background-color: $--checkbox-disabled-checked-input-fill;
        border-color: $--checkbox-disabled-checked-input-border-color;

        &::after {
          border-color: $--checkbox-disabled-checked-icon-color;
        }
      }
    }

    &.is-indeterminate {
      .yi-checkbox__inner {
        background-color: $--checkbox-disabled-checked-input-fill;
        border-color: $--checkbox-disabled-checked-input-border-color;

        &::before {
          background-color: $--checkbox-disabled-checked-icon-color;
          border-color: $--checkbox-disabled-checked-icon-color;
        }
      }
    }

    & + span.yi-checkbox__label {
      color: $--disabled-color-base;
      cursor: not-allowed;
    }
  }
  .yi-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px;
  }
  .yi-checkbox__original {
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
  }
}
</style>