export const NODE_KEY = '$treeNodeId'

export const getPropertyFromData = (node, prop) => {
    const props = node.store.props;
    const data = node.data || {};
    const config = props[prop];
    if (typeof config === 'function') {
      return config(data, node);
    } else if (typeof config === 'string') {
        return data[config];
    } else if (typeof config === 'undefined') {
        const dataProp = data[prop];
        return dataProp === undefined ? '' : dataProp;
    }
}

export const getNodeKey = (key, data) => {
    if (!key) return data[NODE_KEY];
    return data[key];
}

export const reInitChecked = (node) => {
    if (node.childNodes.length === 0) return
    const { all, none, half } = getChildState(node.childNodes)
    if (all) {
        node.checked = true
        node.indeterminate = false
    } else if (half) {
        node.checked = false
        node.indeterminate = true
    } else if (none) {
        node.checked = false
        node.indeterminate = false
    }

    const parent = node.parent
    if (!parent || parent.level === 0) return;

    if (!node.store.checkStrictly) {
        reInitChecked(parent)
    }
}

export const getChildState = (node) => {
    let all = true, none = true, allWithoutDisable = true
    for (let i = 0, len = node.length; i < len; i++) {
        const n = node[i]
        if (n.checked !== true || n.indeterminate) {
            all = false
            if (!n.disabled) {
                allWithoutDisable = false
            }
        }
        if (n.checked !== false || n.indeterminate) {
            none = false
        }
    }

    return { all, none, allWithoutDisable, half: !all && !none }
}