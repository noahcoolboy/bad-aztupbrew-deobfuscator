-- Original script:
-- print("1")

--[[
AztupBrew(Fork of IronBrew2): obfuscation; Version 2.7.2
]]
return (function(g, a, a)
    local j = string.char
    local e = string.sub
    local o = table.concat
    local n = math.ldexp
    local m = getfenv or function()
            return _ENV
        end
    local l = select
    local a = unpack or table.unpack
    local k = tonumber
    local function p(h)
        local b, c, d = "", "", {}
        local f = 256
        local g = {}
        for a = 0, f - 1 do
            g[a] = j(a)
        end
        local a = 1
        local function i()
            local b = k(e(h, a, a), 36)
            a = a + 1
            local c = k(e(h, a, a + b - 1), 36)
            a = a + b
            return c
        end
        b = j(i())
        d[1] = b
        while a < #h do
            local a = i()
            if g[a] then
                c = g[a]
            else
                c = b .. e(b, 1, 1)
            end
            g[f] = b .. e(c, 1, 1)
            d[#d + 1], b, f = c, c, f + 1
        end
        return table.concat(d)
    end
    local i =
        p(
        "22N22L27522N22G27522L21921B21G21F21522N22K27923027927522H27922722M27927H27522727527H27427927827622L27R22I27Q279"
    )
    local a = (bit or bit32)
    local d = a and a.bxor or function(a, c)
            local b, d, e = 1, 0, 10
            while a > 0 and c > 0 do
                local e, f = a % 2, c % 2
                if e ~= f then
                    d = d + b
                end
                a, c, b = (a - e) / 2, (c - f) / 2, b * 2
            end
            if a < c then
                a = c
            end
            while a > 0 do
                local c = a % 2
                if c > 0 then
                    d = d + b
                end
                a, b = (a - c) / 2, b * 2
            end
            return d
        end
    local function c(b, a, c)
        if c then
            local a = (b / 2 ^ (a - 1)) % 2 ^ ((c - 1) - (a - 1) + 1)
            return a - a % 1
        else
            local a = 2 ^ (a - 1)
            return (b % (a + a) >= a) and 1 or 0
        end
    end
    local a = 1
    local function b()
        local f, e, c, b = g(i, a, a + 3)
        f = d(f, 93)
        e = d(e, 93)
        c = d(c, 93)
        b = d(b, 93)
        a = a + 4
        return (b * 16777216) + (c * 65536) + (e * 256) + f
    end
    local function h()
        local b = d(g(i, a, a), 93)
        a = a + 1
        return b
    end
    local function f()
        local b, c = g(i, a, a + 2)
        b = d(b, 93)
        c = d(c, 93)
        a = a + 2
        return (c * 256) + b
    end
    local function p()
        local a = b()
        local b = b()
        local e = 1
        local d = (c(b, 1, 20) * (2 ^ 32)) + a
        local a = c(b, 21, 31)
        local b = ((-1) ^ c(b, 32))
        if (a == 0) then
            if (d == 0) then
                return b * 0
            else
                a = 1
                e = 0
            end
        elseif (a == 2047) then
            return (d == 0) and (b * (1 / 0)) or (b * (0 / 0))
        end
        return n(b, a - 1023) * (e + (d / (2 ^ 52)))
    end
    local k = b
    local function n(b)
        local c
        if (not b) then
            b = k()
            if (b == 0) then
                return ""
            end
        end
        c = e(i, a, a + b - 1)
        a = a + b
        local b = {}
        for a = 1, #c do
            b[a] = j(d(g(e(c, a, a)), 93))
        end
        return o(b)
    end
    local a = b
    local function o(...)
        return {...}, l("#", ...)
    end
    local function k()
        local j = {}
        local e = {}
        local a = {}
        local i = {
            [#{{499, 523, 385, 984}, {383, 651, 403, 988}}] = e,
            [#{{355, 804, 183, 779}, "1 + 1 = 111", {394, 683, 804, 391}}] = nil,
            [#{"1 + 1 = 111", "1 + 1 = 111", {523, 331, 617, 267}, "1 + 1 = 111"}] = a,
            [#{"1 + 1 = 111"}] = j
        }
        local a = b()
        local d = {}
        for c = 1, a do
            local b = h()
            local a
            if (b == 0) then
                a = (h() ~= 0)
            elseif (b == 3) then
                a = p()
            elseif (b == 2) then
                a = n()
            end
            d[c] = a
        end
        for a = 1, b() do
            e[a - 1] = k()
        end
        i[3] = h()
        for i = 1, b() do
            local a = h()
            if (c(a, 1, 1) == 0) then
                local e = c(a, 2, 3)
                local g = c(a, 4, 6)
                local a = {f(), f(), nil, nil}
                if (e == 0) then
                    a[3] = f()
                    a[4] = f()
                elseif (e == 1) then
                    a[3] = b()
                elseif (e == 2) then
                    a[3] = b() - (2 ^ 16)
                elseif (e == 3) then
                    a[3] = b() - (2 ^ 16)
                    a[4] = f()
                end
                if (c(g, 1, 1) == 1) then
                    a[2] = d[a[2]]
                end
                if (c(g, 2, 2) == 1) then
                    a[3] = d[a[3]]
                end
                if (c(g, 3, 3) == 1) then
                    a[4] = d[a[4]]
                end
                j[i] = a
            end
        end
        return i
    end
    local function j(a, b, g)
        a = (a == true and k()) or a
        return (function(...)
            local h = a[1]
            local c = a[3]
            local a = a[2]
            local a = o
            local d = 1
            local a = -1
            local i = {}
            local f = {...}
            local e = l("#", ...) - 1
            local a = {}
            local b = {}
            for a = 0, e do
                if (a >= c) then
                    i[a - c] = f[a + 1]
                else
                    b[a] = f[a + #{"1 + 1 = 111"}]
                end
            end
            local a = e - c + 1
            local a
            local c
            while true do
                a = h[d]
                c = a[1]
                if c <= 3 then
                    if c <= 1 then
                        if c == 0 then
                            b[a[2]] = a[3]
                        else
                            b[a[2]] = a[3]
                        end
                    elseif c == 2 then
                        b[a[2]] = g[a[3]]
                    else
                        b[a[2]] = g[a[3]]
                    end
                elseif c <= 5 then
                    if c > 4 then
                        local a = a[2]
                        b[a](b[a + 1])
                    else
                        do
                            return
                        end
                    end
                elseif c > 6 then
                    do
                        return
                    end
                else
                    local a = a[2]
                    b[a](b[a + 1])
                end
                d = d + 1
            end
        end)
    end
    return j(true, {}, m())()
end)(string.byte, table.insert, setmetatable)
