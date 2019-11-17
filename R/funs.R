require(dplyr)
require(lubridate)
require(geojsonio)

# Stations metadata retrieved from the DNA of Finland API
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

#' Prepare data from the DNA of Helsinki API
#'
#' @param data data frame with columns serial, hash, time, longitude, latitude, distance
#'
#' @return data frame
#' @export
prepare_data <- function(data) {
  tbl_df(data) %>% 
    rename(beacon = serial, device = hash) %>% 
    mutate(time_clean = as_datetime(time), 
           time_interval = floor_date(time_clean, unit="10 seconds"), 
           beacon_name = stations[data$serial]) 
}

#' Summarise data
#'
#' @param data data frame as returned from DNA of Helsinki API
#'
#' @return data frame
#' @export
#' @examples 
#' summarise_data(fromJSON("data/data.json")$raw)
summarise_data <- function(data) {
  data %>% 
    prepare_data  %>% 
    group_by(beacon_name, time_interval, latitude, longitude) %>% 
    summarise(n_people = length(unique(device)), 
              avg_dist = median(distance)) 
}

#' Read a geojson file into a dataframe
#'
#' @param filename 
#'
#' @return data frame
#' @export
#'
#' @examples
read_geojson <- function(filename) {
  tmp = geojsonio::geojson_read(filename, parse=T)
  cbind(tmp$features$properties, tmp$features$geometry)
}

#' Sample a person around a point
#' We have a beacon at [longitude, latitude]. At distance `d` there is a device.
#' We fit a 2D iid Gaussian with mu=[longitude, latitude] and Sigma=f(`d`).
#' `d` is in meters while x,y are in radians, so `d` is approximated in radians.
#' Reference: https://stackoverflow.com/questions/2839533/adding-distance-to-a-gps-coordinate
#'
#' @param latitude numeric
#' @param longitude numeric 
#' @param distance numeric
#'
#' @return numeric vector length 2 of latitude and longitude
#' @export
#'
#' @examples
sample_person <- function(latitude, longitude, distance) {
  d_lat = (180/pi)*(distance/6378137)
  d_lon = (180/pi)*(distance/6378137) / cos(latitude)
  MASS::mvrnorm(n=1, mu=c(latitude, longitude), Sigma=abs(c(d_lat, d_lon))*diag(2))
}

#' Sample random points around beacons and add them as columns to data frame
#'
#' @param df data frame with columns latitude, longitude, distance
#'
#' @return df with two extra columns
#' @export
#'
#' @examples
add_random_device_coordinates <- function(df) {
  df$device_lat = mapply(sample_person, df$latitude, df$longitude, df$distance)[1,]
  df$device_lon = mapply(sample_person, df$latitude, df$longitude, df$distance)[2,]
  df
}

#' Read weather data into a data frame
#'
#' @param filename 
#'
#' @return data frame
#' @export
#'
#' @examples
read_weather <- function(filename = "data/Helsinki_weather_data.csv") {
  weather_raw = read.csv(filename)
  tbl_df(weather_raw) %>% 
    mutate(Time = as.character(Time),
           datetime = as.POSIXct(paste(paste(Year, m, d, sep="-"), Time), tz="UTC")) %>% 
    select(datetime, 
           temperature = Air.temperature..degC., 
           temperature_dew = Dew.point.temperature..degC., 
           clouds = Cloud.amount..1.8., 
           humidity = Relative.humidity....)
}