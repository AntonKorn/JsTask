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
    let self = {
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

function createMemoizer(f) {

    function CacheNode() {
        return {
            result: {
                isSet: false,
                value: undefined
            },
            children: {}
        };
    }

    let cacheRoot = new CacheNode();

    return function memoizer(...args) {
        let currentNode = cacheRoot;

        for (let i = 0; i < args.length; i++) {
            let currentArg = args[i];
            if (!currentNode.children[currentArg])
                currentNode.children[currentArg] = new CacheNode();
            currentNode = currentNode.children[currentArg];
        }

        if (!currentNode.result.isSet) {
            currentNode.result.value = f(...args);
            currentNode.result.isSet = true;
        }

        return currentNode.result.value;
    };
}