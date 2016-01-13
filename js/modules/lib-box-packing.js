define(['angular', 'app'], function (angular, app) {
    
    // adapted from https://github.com/jakesgordon/bin-packing/

    return function (box) {
        // sort by volume or index
        box.sort(function (a, b) {
            return (b.w * b.h) - (a.w * a.h) || a.index - b.index;
        });

        var node;
        var root = {
            x: 0,
            y: 0,
            w: box[0] ? box[0].w : 0,
            h: box[0] ? box[0].h : 0
        };
        for (var i = 0, block; block = box[i]; i++) {
            if (node = findNode(root, block))
                block.fit = splitNode(node, block);
            else
                block.fit = growNode(block);
        }
        box.w = root.w;
        box.h = root.h;

        function findNode(root, block) {
            if (root.used)
                return findNode(root.right, block) || findNode(root.down, block);
            else if ((block.w <= root.w) && (block.h <= root.h))
                return root;
            else
                return null;
        }

        function splitNode(node, block) {
            node.used = true;
            node.down = {
                x: node.x,
                y: node.y + block.h,
                w: node.w,
                h: node.h - block.h
            };
            node.right = {
                x: node.x + block.w,
                y: node.y,
                w: node.w - block.w,
                h: block.h
            };
            return node;
        }

        function growNode(block) {

            var canGrowDown = (block.w <= root.w);
            var canGrowRight = (block.h <= root.h);

            var shouldGrowRight = canGrowRight && (root.h >= (root.w + block.w)); 
            var shouldGrowDown = canGrowDown && (root.w >= (root.h + block.h));

            if (shouldGrowRight)
                return growRight(block);
            else if (shouldGrowDown)
                return growDown(block);
            else if (canGrowRight)
                return growRight(block);
            else if (canGrowDown)
                return growDown(block);
            else
                throw "Failed to grow";
        }

        function growRight(block) {
            root = {
                used: true,
                x: 0,
                y: 0,
                w: root.w + block.w,
                h: root.h,
                down: root,
                right: {
                    x: root.w,
                    y: 0,
                    w: block.w,
                    h: root.h
                }
            };
            var node;
            if (node = findNode(root, block))
                return splitNode(node, block);
            else
                throw "Failed to grow right";
        }

        function growDown(block) {
            root = {
                used: true,
                x: 0,
                y: 0,
                w: root.w,
                h: root.h + block.h,
                down: {
                    x: 0,
                    y: root.h,
                    w: root.w,
                    h: block.h
                },
                right: root
            };
            var node = findNode(root, block);
            if (node)
                return splitNode(node, block);
            else
                throw "Failed to grow down";
        }
    };
});