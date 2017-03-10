import Vue from "vue"
import goban from "./components/goban"
import gobanSlot from "./components/gobanSlot"
import gobanMarker from "./components/gobanMarker"
import stone from "./components/Stone"
import slotModel from "./models/slot"
import EventBus from "./controllers/EventBus"
const vm = new Vue({
    el: "#app",
    data: {
        size: 13,
        colorPlayer: "black",
        hasCreatedPosition: false,
        gobanSlots: null,
        lettersAsMarker: true,
        markersSide: {
            x: "x",
            y: "y"
        },
        turnCount: 1
    },
    computed: {
        getGobanSlots() {
            if(!this.hasCreatedPosition) {
                this.hasCreatedPosition = true;
                this.gobanSlots = this.createSlotsPosition();
                return this.createSlotsPosition();
            }
            return this.gobanSlots
        }
    },
    methods: {
        createSlotsPosition() {
            let map = {};
            let size = this.size;
            for(let y = 1; y <= size;y++) {
                for(let x = 1 ;x <= size; x++) {
                    let model = new slotModel(x,y,false,null);
                    let key = x+","+y;
                    map[key] = model;
                }
            }
            return map;
        },
        endTurn(payload) {
            //const slot = payload.slot;
            //this.goban[slot.x+","+slot.y] = slot;
            this.turnCount++;

        }

    }
});


EventBus.$on("goban:endPhase",function (payload) {
    vm.turnCount++
});

