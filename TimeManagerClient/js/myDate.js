/**
 *
 * by littlefean
 */

class MyDate {
    constructor(y, m, d) {
        this.year = y;
        this.month = m;
        this.day = d;
    }

    /**
     * >>> "2019.5.15"
     * @param string {String}
     * @constructor
     */
    static FromString(string) {
        let arr = string.split(".");
        return new this(...arr);
    }

    /**
     * >>> "2019-5-15"
     * @param string {String}
     * @constructor
     */
    static FromString_(string) {
        let arr = string.split("-");
        return new this(...arr);
    }


    toStringDote() {
        return `${this.month}.${this.day}`;
    }

    toString_() {
        return `${this.year}-${this.month}-${this.day}`;
    }

    toString() {
        return `<${this.year},${this.month},${this.day}>`
    }

    static FromNow() {
        let d = new Date();
        return new this(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

}

console.log(MyDate.FromString("2018.5.3"));
