import Vue from "vue"
function toArabicNumeral(en) {
    en = en.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return ("" + en).replace(/[0-9]/g, function(t) {
        return "٠١٢٣٤٥٦٧٨٩".substr(+t, 1);
    });
}

Vue.filter("number",  toArabicNumeral);