<template>
    <v-text-field
    @blur="$emit('blur',$event)"
    @change="$emit('change',$event)"
    @click="$emit('click',$event)"
    @click:append="$emit('click:append',$event)"
    @click:append-outer="$emit('click:append-outer',$event)"
    @click:clear="$emit('click:clear',$event)"
    @click:prepend="$emit('click:prepend',$event)"
    @click:prepend-inner="$emit('click:prepend-inner',$event)"
    @focus="$emit('focus',$event)"
    @keydown="$emit('keydown',$event)"
    @mousedown="$emit('mousedown',$event)"
    @mouseup="$emit('mouseup',$event)"
    @update:error="$emit('update:error',$event)"
    v-model="input"
    :dir="dir"
    :hide-details="hideDetails"
    :dense="dense"
    :outlined="outlined"
    :label="label"
    :append-icon="appendIcon"
    :prepend-icon="prependIcon"
    :append-outer-icon="appendOuterIcon"
    :autofocus="autofocus"
    :clear-icon="clearIcon"
    :background-color="backgroundColor"
    :color="color"
    :counter="counter"
    :counter-value="counterValue"
    :dark="dark"
    :error="error"
    :error-count="errorCount"
    :filled="filled"
    :flat="flat"
    :full-width="fullWidth"
    :height="height"
    :hint="hint"
    :id="id"
    :light="light"
    :loader-height="loaderHeight"
    :loading="loading"
    :messages="messages"
    :persistent-placeholder="persistentPlaceholder"
    :persistent-hint="persistentHint"
    :placeholder="placeholder"
    :prefix="prefix"
    :prepend-inner-icon="prependInnerIcon"
    :readonly="readonly"
    :reverse="reverse"
    :rounded="rounded"
    :rules="rules"
    :shaped="shaped"
    :single-line="singleLine"
    :solo="solo"
    :solo-inverted="soloInverted"
    :success="success"
    :success-messages="successMessages"
    :suffix="suffix"
    :type="type"
    :validate-on-blur="validateOnBlur"
    :disabled="disabled"
    >
        <slot></slot>
        <template v-slot:append>
            <slot name='append'></slot>
        </template>
        <template v-slot:append-outer>
            <slot name="append-outer"></slot>
        </template>
        <template v-slot:counter="{ props }">
            <slot name="counter" v-bind="{ props }"></slot>
        </template>
        <template v-slot:label>
            <slot name="label"></slot>
        </template>
        <template v-slot:message="{key, message}">
            <slot name="message" v-bind="{key, message}"></slot>
        </template>
        <template v-slot:prepend>
            <slot name="prepend"></slot>
        </template>
        <template v-slot:prepend-inner>
            <slot name="prepend-inner"></slot>
        </template>
        <template v-slot:progress>
            <slot name="progress"></slot>
        </template>
    </v-text-field>
</template>
<script>
export default {
    props: {
        value: Boolean,
        dense: {
            type: Boolean,
            default: true
        },
        dir: String,
        outlined: {
            type: Boolean,
            default: true
        },
        outlined: {
            type: Boolean,
            default: true
        },
        label: {
            type: String,
        },
        appendIcon: {
            type: String,
        },
        prependIcon: {
            type: String,
        },
        appendOuterIcon : {
            type: String
        },
        autofocus: {
            type: Boolean
        },
        clearIcon: {
            type: String
        },
        clearable: {
            type: Boolean
        },
        disabled: {
            type: Boolean
        },
        backgroundColor: {
            type: String
        },
        color: {
            type: String
        },
        counter: {
            type: [Boolean, Number, String]
        },
        counterValue: {
            type: Function
        },
        dark: {
            type: Boolean
        },
        error: {
            type: Boolean
        },
        errorCount: {
            type: [Number, String],
            default: 1
        },
        errorMessages: {
            type: [String, Array]
        },
        filled: {
            type: Boolean
        },
        flat: {
            type: Boolean
        },
        fullWidth: {
            type: Boolean
        },
        height: {
            type: [Number, String]
        },
        hideDetails: {
            type: [Boolean, String],
            default: true
        },
        id: {
            type: String
        },
        hint: {
            type: String
        },
        light: {
            type: Boolean
        },
        loaderHeight: {
            type: [Number, String],
            default: 2
        },
        loading: {
            type: Boolean
        },
        messages: {
            type: [String, Array]
        },
        persistentHint: {
            type: Boolean
        },
        persistentPlaceholder: {
            type: Boolean
        },
        placeholder: {
            type: String
        },
        prefix: {
            type: String
        },
        prependInnerIcon: {
            type: String
        },
        readonly: {
            type: Boolean
        },
        reverse: {
            type: Boolean
        },
        rounded: {
            type: Boolean
        },
        rules: {
            type: Array
        },
        shaped: {
            type: Boolean
        },
        singleLine: {
            type: Boolean
        },
        solo: {
            type: Boolean
        },
        soloInverted: {
            type: Boolean
        },
        success: {
            type: Boolean
        },
        successMessages: {
            type: [String, Array]
        },
        suffix: {
            type: String
        },
        type: {
            type: String,
            default: 'text'
        },
        validateOnBlur: {
            type: Boolean
        },
        value: {
            type: undefined 
        },
        
    },
    computed: {
        input: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input',val)
            }
        }
    }
}
</script>