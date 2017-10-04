import numpy as np

def dual_simplex(A, b, c, dL, dU, Jb):
    def get_column(A, n):
        return [A[i][n] for i in range(0,len(A))]
    inf = float("inf") # inf
    iterations = 0
    xi = []
    Jb = [x - 1 for x in Jb]

    while(True):
        iterations += 1
        stop_solved = True
        stop_nosolution = False

        # step 1
        Ab = []
        cb = []
        n = len(A[0])
        m = len(A)
        for j in Jb:
            Ab.append(get_column(A, j))
            cb.append(c[j])

        Ab = np.transpose(Ab)
        B = np.linalg.inv(Ab)

        y = np.matmul(cb, B)
        delta = np.subtract(np.matmul(y, A), c) # coplan
        Jn = []
        for i in range(n):
            if i not in Jb:
               Jn.append(i)
        JnPos = []
        JnNeg = []
        for i in Jn:
            if delta[i] >= 0:
                JnPos.append(i)
            else:
                JnNeg.append(i)

        # step 2
        xi = [0] * n  # pseudoplan
        for i in JnPos:
            xi[i] = dL[i]
        for i in JnNeg:
            xi[i] = dU[i]
        temp = [0] * len(Jb)
        for j in Jn:
            temp = np.add(temp, xi[j] * np.array(get_column(A, j)))
        xiB = np.matmul(B, (b - temp))
        for i in range(len(xiB)):
            xi[Jb[i]] = xiB[i]

        # step 3
        j_star = -1
        for i in range(n):
            if not (xi[i] >= dL[i] and xi[i] <= dU[i]):
                stop_solved = False
                j_star = i
                break

        if stop_solved:
            break

        # step 4
        mu = [0] * n
        if xi[j_star] < dL[j_star]:
            mu[j_star] = 1
        else:
            mu[j_star] = -1

        dy = mu[j_star] * B[Jb.index(j_star)]
        for j in range(n):
            if j != j_star:
                mu[j] = np.matmul(dy, get_column(A,j))

        # step 5
        sigma = []
        for j in Jn:
            if ((j in JnPos) and (mu[j]<0)) or ((j in JnNeg) and (mu[j]>0)):
                sigma.append(-(delta[j]/mu[j]))
            else:
                sigma.append(inf)
        sigma0, jnew = min((sigma0, jnew) for (jnew, sigma0) in enumerate(sigma))
        jnew = Jn[jnew]
        if sigma0 == inf:
            stop_nosolution = True
            break
        Jb[Jb.index(j_star)] = jnew

    if (stop_solved):
        return xi, iterations
    elif (stop_nosolution):
        return None, None

# test 1

A = [
    [1, -5, 3, 1, 0, 0],
    [4, -1, 1, 0, 1, 0],
    [2, 4, 2, 0, 0, 1]
]
b =  [-7, 22, 30]
dL = [2, 1, 0, 0, 1, 1]
dU = [6, 6, 5, 2, 4, 6]
c =  [7, -2, 6, 0, 5, 2]
Jb = [1, 2, 3]

# resault1, iterations = dual_simplex(A, b, c, dL, dU, Jb)

# test 3

A3 = [
    [1, 0, 0, 12, 1, -3, 4, -1],
    [0, 1, 0, 11, 12, 3, 5, 3],
    [0, 0, 1, 1, 0, 22, -2, 1]
]
b3 =  [40, 107, 61]
dL3 = [0, 0, 0, 0, 0, 0, 0, 0]
dU3 = [3, 5, 5, 3, 4, 5, 6, 3]
c3 =  [2, 1, -2, -1, 4, -5, 5, 5]
Jb3 = [1, 2, 3]

resault3, iterations3 = dual_simplex(A3, b3, c3, dL3, dU3, Jb3)

print(resault3)
print(str(iterations3) + ' iterations')


A5 = [
    [1, 7, 2, 0, 1, -1, 4],
    [0, 5, 6, 1, 0, -3, 2],
    [3, 2, 2, 1, 1, 1, 5]
]
b5 =  [1, 4, 7]
dL5 = [-1, 1, -2, 0, 1, 2, 4]
dU5 = [3, 2, 2, 5, 3, 4, 5]
c5 =  [1, 2, 1, -3, 3, 1, 0]
Jb5 = [1, 2, 3]

resault5, iterations5 = dual_simplex(A5, b5, c5, dL5, dU5, Jb5)

print(resault5)
print(str(iterations5) + ' iterations')

