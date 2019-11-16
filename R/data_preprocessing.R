library(dplyr)
library(jsonlite)
library(lubridate)
library(ggplot2)

#### AZURE INPUT ####
# Map 1-based optional input ports to variables
data <- maml.mapInputPort(1) # class: data.frame
dataset2 <- maml.mapInputPort(2) # class: data.frame

#### ####
data = fromJSON("data/data.json")$raw

stations = c(
  `0000000006dd41f6` = "Hernesaari LHC",
  `000000000f4919c9` = "Amos Rex",
  `0000000019fb59c4` = "Lansiterminaali 1",
  `00000000342570c2` = "Sibelius Monumentti",
  `0000000038bf9618` = "Kaivopuiston ranta",
  `0000000038d83d41` = "Pakkahuoneenlaituri",
  `000000004ef3150d` = "Lansiterminaali 2",
  `0000000053c6c2be` = "Katajanokan laituri 2",
  `00000000675d5200` = "Hakaniemen kauppahalli 1",
  `000000006b087f40` = "Ateneum",
  `000000006b44cce7` = "Kauppatori",
  `0000000074f765a7` = "Oodi",
  `000000007b5207b6` = "Hakaniemen kauppahalli 2",
  `0000000096918cfa` = "Temppeliaukion kirkko",
  `00000000a53ed894` = "Hernesaari LHD",
  `00000000aa852af1` = "Senaatintori lantinen",
  `00000000afef4555` = "Stockmann",
  `00000000b33a8357` = "Kamppi",
  `00000000cd16b8ef` = "Senaatintori itainen",
  `00000000d747f075` = "Katajanokan terminaali",
  `00000000e8a064a4` = "Hernesaari LHB",
  `00000000f1124bca` = "Olympiaterminaali",
  `00000000fb7600be` = "Katajanokan laituri",
  `00000000fdda10fe` = "Dianapuisto",
  `00000000fffb8cf0` = "Suomenlinna"
)

#' Prepare data from Business Finland API
#'
#' @param data data frame with columns serial, hash, time, longitude, latitude, distance
#'
#' @return data frame
#' @export
prepare_data <- function(data) {
  dat = tbl_df(data) %>% 
    rename(beacon = serial, device = hash) %>% 
    mutate(time_clean = as_datetime(time), 
           time_interval = floor_date(time_clean, unit="10 seconds"), 
           beacon_name = stations[data$serial]) 
  dat
}

# Number of devices connected per beacon per 10 seconds
data %>% 
  prepare_data %>% 
  group_by(beacon_name, time_interval) %>% 
  summarise(n_devices = length(unique(device))) %>% 
  ggplot() + 
  geom_line(aes(x = time_interval, y=n_devices, color=beacon_name))

# Number of devices connected per beacon, shown on a map
data %>% 
  prepare_data %>% 
  group_by(beacon, latitude, longitude) %>% 
  summarise(n_devices = length(unique(device))) %>% 
  ggplot() + 
  geom_point(aes(x = longitude, y=latitude, size=n_devices, color=beacon))


#### AZURE OUTPUT ####
# Select data.frame to be sent to the output Dataset port
maml.mapOutputPort("data")