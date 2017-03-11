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
        self: "black",
        opponent: "white",
        currentPlayer: null,
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
        },
        getCurrentPlayer() {
            if(this.currentPlayer==null) {
                this.currentPlayer = this.self
            }
            return this.currentPlayer
        },
    },
    methods: {
        createSlotsPosition() {
            let map = {};
            let size = this.size;
            for(let y = 1; y <= size;y++) {
                for(let x = 1 ;x <= size; x++) {
                    const params = {
                        x:x,
                        y:y,
                        isFilled:false,
                        isFillable:true,
                        time: null,
                        belongsTo: null,
                        lastUsed: false
                    };
                    let model = new slotModel(params);
                    let key = x+","+y;
                    map[key] = model;
                }
            }
            return map;
        },
        changePlayer() {
            // console.log('changed player');
            if(this.currentPlayer=="black") {
                this.currentPlayer = "white"
            } else if(this.currentPlayer == "white") {
                this.currentPlayer = "black"
            } else {
                console.warn("currentPlayer is neither black or white, equals to "+this.currentPlayer);
            }
        },
        endTurn(goban) {
            this.turnCount++;
            this.gobanSlots = goban;
            this.changePlayer();
        }

    }
});


EventBus.$on("goban:endPhase",vm.endTurn.bind(this,goban));

