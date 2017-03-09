import Vue from "vue"
import goban from "./components/goban"
import gobanSlot from "./components/gobanSlot"
import gobanMarker from "./components/gobanMarker"
import stone from "./components/Stone"
import lodash from "lodash"
import EventBus from "./controllers/EventBus"
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
            let map = {};
            let size = this.size;
            for(let y = 1; y <= size;y++) {
                for(let x = 1 ;x <= size; x++) {
                    let position = {x:x,y:y,isFilled:false};
                    let key = x+","+y;
                    map[key] = position;
                }
            }
            console.log(map);
            return map;
        },
        setPosition(position) {
            this.currentGoban.set(position.x+","+position.y,position);
        }
    }
});
