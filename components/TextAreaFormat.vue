<template>
    <v-card flat :disabled="disabled">
        <slot name="label">
            {{label}}
        </slot>
        <v-card outlined>
            <client-only>
                <tiptap-vuetify :card-props="{ flat: true }" v-model="input" :extensions="extensions" :placeholder="placeholder" />
            </client-only>
        </v-card>
    </v-card>
</template>
<script>
if (process.client) {
    var { 
        TiptapVuetify,
        Heading,
        Bold,
        Italic,
        Strike,
        Underline,
        Code,
        Paragraph,
        BulletList,
        OrderedList,
        ListItem,
        Link,
        Blockquote,
        HardBreak,
        HorizontalRule,
        History,
    } = require('tiptap-vuetify')
}
export default {
    props: {
        value: {
        type: String,
        },
        disabled: {
        type: Boolean,
        default: false,
        },
        label: {
        type: String
        } ,
        placeholder: {
        type: String
        }
    },
    components: { TiptapVuetify },
    data() {
        return {
        // declare extensions you want to use
        extensions: [
            History,
            Blockquote,
            Underline,
            Strike,
            Italic,
            ListItem,
            BulletList,
            OrderedList,
            [
                Heading,
                {
                    options: {
                    levels: [1, 2, 3, 4, 5, 6],
                    },
                },
            ],
            Bold,
            Code,
            HorizontalRule,
            Paragraph,
            HardBreak,
        ],
        // starting editor's content
        content: "",
        };
    },
    computed: {
        input: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    },
};
</script>
<style lang="scss">
.second-toolbar #logo {
    display: none;
}
.fr-wrapper > div {
    display: none;
}
.fr-wrapper > .fr-view {
    display: inherit !important;
}
span.fr-placeholder {
    margin-top: 0 !important;
}
.ProseMirror {
    .tiptap-vuetify-editor__paragraph--is-empty.is-editor-empty {
        & {
        display: flex;
        }
    }
}
</style>