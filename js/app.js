import Vue from "vue"
import goban from "./components/goban"
import gobanSlot from "./components/gobanSlot"
import gobanMarker from "./components/gobanMarker"
import stone from "./components/Stone"
import lodash from "lodash"
const vm = new Vue({
    el: "#app",
    data: {
        size: 13,
        colorPlayer: "black",
        hasCreatedPosition: false,
        currentGoban: null,
        lettersAsMarker: true,
        markersSide: {
            x: "x",
            y: "y"
        }
    },
    computed: {
        slotPositionList() {
            if(!this.hasCreatedPosition) {
                this.hasCreatedPosition = true;
                return this.createSlotsPosition();
            } else {
                return this.currentGoban
            }
        }
    },
    methods: {
        createSlotsPosition() {
            let result = [];
            let size = this.size;
            for(let y = 1;y <= size;y++) {
                for(let x = 1 ;x <= size; x++) {
                    result.push({x:x,y:y});
                }
            }
            return result;
        }
    }
});
