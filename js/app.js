import Vue from "vue"
import goban from "./components/goban"
import gobanSlot from "./components/gobanSlot"
import stone from "./components/Stone"
import lodash from "lodash"
const vm = new Vue({
    el: "#app",
    data: {
        slotCount: 13*13,
        size: 13,
        colorPlayer: "black",
        hasCreatedPosition: false,
        currentGoban: null
    },
    computed: {
        slots() {
            if(!this.hasCreatedPosition) {
                return this.createSlotsPosition();
                this.hasCreatedPosition = true;
            } else {
                return this.currentGoban
            }
        }
    },
    methods: {
        createSlotsPosition() {
            let result = [];
            for(let y = 1;y <= this.size;y++) {
                for(let x = 1 ;x <= this.size; x++) {
                    result.push(x+","+y);
                }
            }
            return result;
        }
    }
});
