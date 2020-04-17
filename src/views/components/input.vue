<template>
  <div class="mh-input">
    <label v-if="label" :name="label" v-text="label" class="mh-input__label" :class="{'mh-textarea__label': type === 'textarea'}"></label>
		<input :type="type"
           v-if="['text', 'number', 'email', 'time', 'password'].includes(type)"
           ref="input"
           :value = "value"
           @input="handleInput"
           :placeholder="placeholder"
           @blur="handleBlur"
           :class="{'is-error': showError, 'disabled': disabled, [inputClass]: inputClass }"
          :disabled="disabled"/>
		<textarea :type="type" v-if="type==='textarea'"
           rows="3"
           ref="input"
           :value = "value"
           @input="handleInput"
           :placeholder="placeholder"
           @blur="handleBlur"
           :class="{'is-error': showError, [inputClass]: inputClass}"/>

    <el-select :value="value"
               v-if="type==='select'"
               :class="{'is-error': showError, [inputClass]: inputClass}">
      <el-option v-for="(item, index) in selectGroup"
                 :value="item.value"
                 :key="index"
                 :label="item.label"
                 @click.native="handleSelect(item)">
      </el-option>
    </el-select>

    <slot></slot>

    <div class="error error-text" v-if="showError">
      {{errorMessage}}
    </div>
	</div>
</template>

<script>
import { stopBubble } from '@/views/utils/utils';
export default {
	name: 'Input',
	 props: {
      value: {
        type: [String, Number, Boolean]
      },
      label: {
        type: String,
        default: ''
      },
      validate: {
        type: Function
      },
      required: {
        type: [Boolean, String],
        default: false
      },
      type: {
        type: String,
        default: 'text'
      },
      errorMessage: String,
      showError: Boolean,
      prop: String,
      selectGroup: Array,
      helperName: String,
      placeholder: String,
      disabled: {
        type: Boolean,
        default: false
      },
      inputClass: String 
    },

    data() {
      return {
        isComposing: false,
      }
    },

    methods: {
      //处理@input事件做到双向绑定
      handleInput(event) {
        let flag = new Date();
        //防抖
        if(new Date() - flag > 500)
        this.$emit('input', event.target.value);
        stopBubble(event);
      },
      //处理失焦事件
      handleBlur(event) {
        this.$emit('input', event.target.value);
        this.$emit('validate', this.prop);
      },
      //处理选择框事件
      handleSelect(item) {
        this.$emit('changeOption', item);
        this.$emit('input', item.value);
        this.$emit('validate', this.prop);
      }
    }
}
</script>