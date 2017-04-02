/**
 * Created by Ismaël on 02/04/2017.
 */
export default class GroupModel {
    /**
     *
     * @param slots {Array} An Array of objects {SlotModel}
     */
    constructor(slots) {
        this.slots = slots;
        this.slug = "group";
    }

    /**
     * Adds one or many slots to the group.
     * @param slots {Array | Object} The slot(s) to add to the group
     */
    add(slots) {
        if(slots) {
            if(Array.isArray(slots)) {
                this.slots.concat(slots);
            } else if(typeof slots === 'object') {
                this.slots.push(slots);
            } else {
                console.warn(`Can't add these slots to the group. Value : ${slots}`);
            }
        } else {
            console.warn(`Can't add a falsy value to the group. Value : ${slots}`);
        }
    }
    generateId() {
        let result = [];
        this.slots.forEach((slot)=> {
            result.push(String(slot.x) + String(slot.y))
        });
        result = result.sort();
        this.id = result.join('');
    }
    destroy(slots) {
        if(slots) {
            let i = 0;
            this.slots.forEach((slot)=> {
                if(slot.relationships[this.slug] && !slot.relationships[this.slug].includes(this.id)) {
                    this.slots.splice(i,1);
                }
                i++;
            });
        } else {
            console.warn(`Can't delete falsy value from the group. Value : ${slots}`);
        }
    }
}