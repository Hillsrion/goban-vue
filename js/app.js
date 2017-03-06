import Vue from "vue"
import goban from "./components/goban"
import gobanSlot from "./components/gobanSlot"
import stone from "./components/Stone"
const vm = new Vue({
    el: "#app",
    data: {
        slotCount: 13*13,
        small: 9,
        medium: 13,
        large: 19,
        colorPlayer: "black"
    },
    computed: {

    }
});
