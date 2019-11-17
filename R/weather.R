source("R/funs.R")

weather = read_weather()


august_summary_weather = left_join(august_summary, weather, by = c("time_interval"="datetime")) 
