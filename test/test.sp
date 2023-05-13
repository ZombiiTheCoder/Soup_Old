mal foo = 45/2;

def obj = {
    x: 100,
    y: 32,
    foo,
    complex: {
        bar: true,
    },
};

Soup makeAdder(x, y) {
    Soup add (x, y) {
        mal result = x + y;
        result+5
    }
    
    add(x, y)
}

def result = makeAdder(10, 4);
print(result)