# -*- coding: utf-8 -*-
import numpy
from scipy import stats
import matplotlib.pyplot as plt

speed = [99,86,87,88,111,86,103,87,94,78,77,85,86]

# The mean value is the average value
# x = numpy.mean(speed)

# The median value is the value in the middle, after you have sorted all the values
# x = numpy.median(speed)

# The Mode value is the value that appears the most number of times
# x = stats.mode(speed)

#Standard deviation is a number that describes how spread out the values are
# x = numpy.std(speed)

# Variance is another number that indicates how spread out the values are or Standar deviation ** 2
# x = numpy.var(speed)

# Percentiles are used in statistics to give you a number that describes the value that a given percent of the values are lower than
# x = numpy.percentile(speed, 75)

# print(x)

# Create an array containing 250 random floats between 0 and 5
# x = numpy.random.uniform(0.0, 5.0, 100000)

# A typical normal data distribution
x = numpy.random.normal(5.0, 1.0, 100000)
print(x)
plt.hist(x, 100)
plt.show()

# x = [5,7,8,7,2,17,2,9,4,11,12,9,6]
# y = [99,86,87,88,111,86,103,87,94,78,77,85,86]

# x = numpy.random.normal(5.0, 1.0, 1000)
# y = numpy.random.normal(10.0, 2.0, 1000)

# plt.scatter(x, y)
# plt.show()