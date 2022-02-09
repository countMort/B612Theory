<template>
    <v-container fluid>
        <v-row class="my-0">
            <v-col :id="`my-node${num}`" cols="6" class="justify-center text-center px-2">
                <v-img class=" mx-auto" max-width="500" max-height="500" contain :src="imageUrl">
                </v-img>
            </v-col>
            <v-col cols="12" md="6">
                <no-ssr>
                    <gallery @image-1="setImage" />
                </no-ssr>
            </v-col>
            <v-col cols="12" md="6">
                <froala :tag="'textarea'" :config="config" v-model="text"></froala>
            </v-col>
            <v-col cols="12" md="6">
                <div id="mydiv">
                    <div class="d-flex px-0 py-0 justify-center" id="mydivheader">
                        <v-icon class="align-self-center" size="12">mdi-arrow-all</v-icon>
                    </div>
                    <p class="fr-element fr-view" flat v-html="text">
                    </p>
                </div>
            </v-col>
        </v-row>
        <!-- <div light id="mydiv">
        <div id="mydivheader" class="d-flex px-0 py-0 justify-center">
            <v-icon class="align-self-center" size="15">mdi-arrow-all</v-icon>
        </div>
            <p class="black--text" id="text" ref="text"></p>
        </div> -->
        <v-btn @click="domToImage"></v-btn>
    </v-container>
</template>
<script>
if (process.client) {
    var  domToImage = require('dom-to-image');
    var phoneDrags =require("@/static/phoneDrags")
}
import gallery from '@/components/editor/Upload'
// import TextEditor from '@/components/editor/TextEditor'
import Editor from "@/components/editor";
// import TextEditor from './TextEditor'
export default {
    props: {
        num: {
            type: Number,
        },
    },
    components: {
        gallery,
        // TextEditor ,
    },
    data() {
        return {
            text: null ,
            h: null ,
            pos1: 0 ,
            pos2: 0 ,
            pos3: 0 ,
            pos4: 0 ,
            imageUrl: null ,
            texts: [] ,
            config: {
                language: 'fa' ,
                placeholderText: 'متن و عکس دلخواه خود را اینجا وارد کنید' ,
                direction: 'rtl'
            }
        }
    },
    watch: {
    } ,
    mounted () {
        this.dragElement(document.getElementById("mydiv"));
        // this.$vuetify.theme = 'light'
    },
    methods: {
        domToImage() {
        var node = document.getElementById('my-node'+num);
        domToImage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
        domToImage.toJpeg(document.getElementById('my-node'+num))
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'my-image-name.jpeg';
            link.href = dataUrl;
            console.log(link);
            link.click();
        });
        // domToImage.toBlob(document.getElementById('my-node'))
        // .then(function (blob) {
        //     window.saveAs(blob, 'my-node.png');
        // });
        } ,
        dragElement(elmnt) {
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = this.dragMouseDown;
            document.getElementById(elmnt.id + "header").ontouchstart = this.dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = this.dragMouseDown;
        }
        } ,

        dragMouseDown(e) {
            console.log(e);
            e = e || window.event;
            if(this.$vuetify.breakpoint.smAndUp) {
                e.preventDefault();
                // get the mouse cursor position at startup:
                this.pos3 = e.clientX;
                this.pos4 = e.clientY;
                // call a function whenever the cursor moves:
                document.onmouseup = this.closeDragElement;
                document.onmousemove = this.elementDrag;
            } else {
                // e.stopPropagation()
                // get the mouse cursor position at startup:
                this.pos3 = e.targetTouches[0].clientX;
                this.pos4 = e.targetTouches[0].clientY;
                // call a function whenever the cursor moves:
                document.ontouchend = this.closeDragElement;
                document.ontouchmove = this.elementDrag;
            }
        } ,

        elementDrag(e) {
        if(this.$vuetify.breakpoint.smAndUp) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            this.pos1 = this.pos3 - e.clientX;
            this.pos2 = this.pos4 - e.clientY;
            this.pos3 = e.clientX;
            this.pos4 = e.clientY;
            // set the element's new position:
            let elmnt = document.getElementById("mydiv")
            elmnt.style.top = (elmnt.offsetTop - this.pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - this.pos1) + "px";
        } else {
            e = e.targetTouches[0] || window.event;
            // e.stopPropagation()
            // calculate the new cursor position:
            this.pos1 = this.pos3 - e.clientX;
            this.pos2 = this.pos4 - e.clientY;
            this.pos3 = e.clientX;
            this.pos4 = e.clientY;
            // set the element's new position:
            let elmnt = document.getElementById("mydiv")
            elmnt.style.top = (elmnt.offsetTop - this.pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - this.pos1) + "px";
        }

        } ,

        closeDragElement() {
        if(this.$vuetify.breakpoint.smAndUp) {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        } else {
        document.ontouchend = null;
        document.ontouchmove = null;
        }
        } ,
        setImage(event) {
            this.imageUrl = event
        } ,
    },
}
</script>

<style scoped lang="scss">
#mydiv {
    touch-action: none;
    position: absolute;
    z-index: 1;
    background-color: none;
    width: 350px;
    // text-align: center;
    &:hover div:first-child {
        display: flex !important;
        position: relative;
        top: -0px ;
        left: 0px;
        padding: 10px;
        cursor: move;
        z-index: 2;
        background-color: none;
        color: #fff;
        border: white dashed 1px;
        width: 15px;
        height: 15px;
    }
    & div:first-child {
        display: none !important;
    }
}

#mydivheader {
    // position: relative;
    // top: -24px ;
    // left: 24px;
    // padding: 10px;
    // cursor: move;
    // z-index: 2;
    // background-color: none;
    // color: #fff;
    // border: white dashed 1px;
    // width: 20px;
    // height: 20px;
    display: none;
}

#text {
    background: none;
}
</style>