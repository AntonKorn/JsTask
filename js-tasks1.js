function first(arr) {
    return arr[0];
}

function last(arr) {
    return arr[arr.length - 1];
}

function skip(arr, number) {
    return arr.filter(i => i !== number);
}

function take(arr, number) {
    return arr.slice(0, number);
}

function isFunction(val) {
    return val && typeof val === 'function';
}

function chain(arr) {
    let arrCopy = arr.slice();

    let self = {
        take: function (val) {
            if (isFunction(val)) {
                arrCopy = arrCopy.filter(val);
            } else {
                arrCopy = take(arrCopy, val);
            }

            return self;
        },

        skip: function (val) {
            if (isFunction(val)) {
                // I actually change value of arrCopy in nested call
                return self.take((...args) => !val(...args));
            }

            arrCopy = skip(arrCopy, val);
            return self;
        },

        value: function () {
            return arrCopy;
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
            arg: null,
            children: []
        };
    }

    let cacheRoot = new CacheNode();

    return function memoizer(...args) {
        let currentNode = cacheRoot;

        for (let i = 0; i < args.length; i++) {
            let currentArg = args[i];

            // Note: perfomance abuse
            let nextNode = first(currentNode.children.filter(c => c.arg === currentArg));

            if (!nextNode) {
                nextNode = new CacheNode();
                nextNode.arg = currentArg;
                currentNode.children.push(nextNode);
            }

            currentNode = nextNode;
        }

        if (!currentNode.result.isSet) {
            currentNode.result.value = f(...args);
            currentNode.result.isSet = true;
        }

        return currentNode.result.value;
    };
}