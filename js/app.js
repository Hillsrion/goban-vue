import Vue from "vue"
import goban from "./components/goban"
import gobanSlot from "./components/gobanSlot"
import gobanMarker from "./components/gobanMarker"
import stone from "./components/Stone"
import slotModel from "./models/slot"
import EventBus from "./controllers/EventBus"
import hoshiCoords from "./settings/hoshi"
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
        hoshiCoords: hoshiCoords,
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
        getTurnCount() {
            return this.turnCount;
        }
    },
    methods: {
        createSlotsPosition() {
            let map = {};
            let size = this.size;
            let isHoshi;
            let hoshiCoords = this.hoshiCoords[this.size].map(function (coord) {
                return coord.x+","+coord.y;
            });
            for(let y = 1; y <= size;y++) {
                for(let x = 1 ;x <= size; x++) {
                    isHoshi = hoshiCoords.includes(x+","+y);
                    const params = {
                        x:x,
                        y:y,
                        isFilled:false,
                        isFillableBy: "",
                        time: null,
                        belongsTo: null,
                        lastUsed: false,
                        isHoshi: isHoshi
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

// Can't bind this here. Otherwise I get a Vue component function in payload parameter.
EventBus.$on("goban:endPhase",(function (payload) {
    this.endTurn(payload)
}).bind(vm));

