#' Read one day of data as returned from python function sample_10sec_per_hour_from_day()
#' and parse it into a data frame.

# Run in Python:
#sample_10sec_per_hour_from_day(date="2019-08-01")
#write_json(result, 'data/raw_one_day.json')

source("funs.R")

filename = "data/one_day.json"
one_day = fromJSON(filename) %>% 
  lapply(function(x) x$raw) %>% 
  Reduce(f = rbind)

one_day_summary = one_day %>% summarise_data()
leafletR::toGeoJSON(one_day_summary, name=paste0(filename, "_summary"), lat.lon=c("latitude", "longitude"))


#### Multiday data ####
filename = "data/august.json"
august = fromJSON(filename) %>% 
  setNames(NULL) %>% 
  unlist(recursive = F) %>% 
  lapply(function(x) x$raw) %>% 
  Reduce(f = rbind)

august_summary = august %>% summarise_data()
leafletR::toGeoJSON(august_summary, name=paste0(filename, "_summary"), lat.lon=c("latitude", "longitude"))

## DRAFT
library(ggplot2)
august_summary %>% 
  group_by(day = floor_date(time_interval, "day"), 
           beacon_name) %>% 
  summarise(max_people = max(n_people), 
            total_people = sum(n_people)) %>% 
  ggplot() + 
  geom_line(aes(x=day, y=total_people, color=beacon_name))

ports = c("Lansiterminaali 1", "Lansiterminaali 2", "Olympiaterminaali", "Katajanokan laituri", "Katajanokan laituri 2", "Katajanokan terminaali")
august_summary %>% 
  filter(beacon_name %in% ports) %>% 
  group_by(day = date(time_interval), 
           beacon_name) %>% 
  summarise(total_people = sum(n_people)) %>% 
  ggplot() + 
  geom_line(aes(x=day, y=total_people, color=beacon_name))


