function first(arr) {
    return arr[0];
}

function last(arr) {
    return first(arr.slice(-1));
}

function skip(arr, number) {
    return arr.slice(number);
}

function take(arr, number) {
    return arr.slice(0, number);
}

function chain(arr) {
    var self = {
        take: function (func) {
            arr = arr.filter(func);
            return self;
        },

        skip: function (func) {
            return self.take((...args) => !func(...args));
        },

        value: function () {
            return arr;
        }
    };

    return self;
}