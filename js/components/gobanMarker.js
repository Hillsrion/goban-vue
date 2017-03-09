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
        count: {
            type: Number,
            required: true,
            default: 19
        },
        lettersAsMarker: Boolean,
        side: String
    },
    computed: {
        classList() {
            const modifier = this.className+"--"+this.side;
            return [this.className,modifier];
        },
        markerClasses() {
            return ["goban__marker"]
        },
        markers() {
            console.log(this.lettersAsMarker)
            if(this.lettersAsMarker) {
                // Picking letters according to the goban size and returning it as an array by joining them.
                return this.letters.substring(0, this.count).split('');
            } else {
                let result = [];
                for(let i =1; i<=this.count;i++) {
                    result.push(i)
                }
                return result;
            }
        }
    }

})