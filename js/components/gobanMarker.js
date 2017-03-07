/**
 * Created by Ismaël on 07/03/2017.
 */
import Vue from "vue"
export default Vue.component("goban-markers",{
    template:
        `<div :class='classList'>
            <div :class="markerClasses"  v-for='marker in markers'>{{ marker }}</div>
        </div>`,
    data() {
        return {
            className: "goban__markers",
            letters: "ABCDEFGHIJKLMNOPQRS",

        }
    },
    props: {
        length: {
            type: Number,
            required: true,
            default: 19
        },
        lettersAsMarker: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        classList() {
            return [this.className,modifier];
        },
        markerClasses() {
            return ["goban__marker"]
        },
        markers() {
            if(this.lettersAsMarker) {
                // Taking letters according to the goban size and returning it as an array by joining them.
                let lettersArray = this.letters.substring(0,this.length).split('');
                return lettersArray;
            } else {
                let result = [];
                for(let i =1; i<=this.length;i++) {
                    result.push(i)
                }
                return result;
            }
        }
    }

})