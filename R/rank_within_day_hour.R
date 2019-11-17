#' For each beacon, calculate rank of people count within days, within hours, within weekdays, within weekdays and hours
#'
#' @param data data frame with columns n_people, time_interval, beacon_name
#'
#' @return data frame
#' @export
#'
#' @examples
compute_ranks <- function(data) {
  data %>% 
    group_by(beacon_name) %>% 
    mutate(n_people_beacon = n_people / max(n_people)) %>% 
    group_by(day = date(time_interval), 
             beacon_name) %>% 
    mutate(day_rank = rank(n_people, ties.method = "min"),
           day_rank = day_rank / max(day_rank)) %>% 
    ungroup() %>% 
    group_by(hour = hour(time_interval), 
             beacon_name) %>% 
    mutate(hour_rank = rank(n_people, ties.method = "min") / n()) %>% 
    ungroup() %>% 
    group_by(weekday = weekdays(time_interval), 
             beacon_name) %>% 
    mutate(weekday_rank = rank(n_people, ties.method = "min") / n()) %>% 
    ungroup() %>% 
    mutate(day_hour_rank_diff = day_rank - hour_rank) %>% 
    group_by(weekday, 
             hour, 
             beacon_name) %>% 
    mutate(weekday_hour_rank = rank(n_people, ties.method = "min"),
           weekday_hour_rank = weekday_hour_rank / max(weekday_hour_rank)) %>% 
    ungroup()
}

august_summary_ranks = compute_ranks(august_summary)

#' Small multiples line plot with every beacon
#'
#' @param data data frame with columns time_interval, n_people_beacon, hour_rank
#' @param day character
#'
#' @return plot
#' @export
#'
#' @examples
plot_hour_rank_multiples <- function(data) {
  # Using weekdays is too noisy. This is only August so there are only 4 Mondays.
  data %>% 
    dplyr::filter(date(time_interval) == "2019-08-01") %>% 
    ggplot() + 
    geom_line(aes(x=time_interval, y=n_people_beacon)) + 
    geom_line(aes(x=time_interval, y=hour_rank), col="red") +
    scale_x_datetime(labels = scales::date_format("%H"), breaks = scales::date_breaks("4 hours")) + 
    xlab("") + ylab("") + 
    labs(title="People volume (black) vs rank of people volume at each hour (red)", 
         subtitle=paste0("On ", day), 
         caption = "If red line is higher than black line, there are more people than usually.") +
    theme_light() + 
    facet_wrap(~beacon_name) 
}
  
plot_hour_rank_multiples(august_summary_ranks)

# Compare the rank measures for one beacon
# august_summary_ranks %>% 
#   filter(date(time_interval) == "2019-08-02", 
#          beacon_name == "Suomenlinna") %>% 
#   ggplot() + 
#   geom_line(aes(x=time_interval, y=n_people_beacon)) + 
#   geom_line(aes(x=time_interval, y=day_rank), col="red") + 
#   geom_line(aes(x=time_interval, y=weekday_rank), col="brown") +
#   geom_line(aes(x=time_interval, y=hour_rank), col="green") 
