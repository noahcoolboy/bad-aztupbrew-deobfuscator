function getIfStatements(parsed) {
    return parsed.body[0].arguments[0].base.body[1].body[1].arguments[0].body.reverse()[0].body.reverse()[1]
    //                                             ^ There should have been a reverse here but everything breaks when I add it
}

function getXorKey(parsed) {
    return parsed.body[0].arguments[0].base.body.find(v => v.type == "FunctionDeclaration" && v.body.length == 5).body[1].init[0].arguments[1].value
}

function getConstantsString(parsed) {
    return parsed.body[0].arguments[0].base.body.find(v => v.type == "LocalStatement" && v.init[0].type == "CallExpression").init[0].arguments[0].raw.replace(/^"/, "").replace(/"$/, "")
}

function getTypeMapping(parsed) {
    let typeIfStatement = parsed.body[0].arguments[0].base.body.reverse()[2].body[6].body[2].clauses
    return [
        typeIfStatement[0].condition.right.value, // Bool
        typeIfStatement[1].condition.right.value, // Number
        typeIfStatement[2].condition.right.value, // String
    ]
}

function findClause(clauses, num) {
    for (let index = 0; index < clauses.length; index++) {
        const clause = clauses[index];
        if (clause.condition && eval(`${num} ${clause.condition.operator} ${clause.condition.right.value}`)) {
            if (clause.body[0].type == 'IfStatement') {
                return findClause(clause.body[0].clauses, num)
            } else {
                return clause.body
            }
        } else if (clause.type == "ElseClause") {
            if (clause.body[0].type == "IfStatement") {
                return findClause(clause.body[0].clauses, num)
            } else {
                return clause.body
            }
        }
    }
}

module.exports = { getIfStatements, findClause, getXorKey, getConstantsString, getTypeMapping }