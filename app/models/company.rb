class Company < ApplicationRecord
  COMPANIES = ["Acme", "Shark", "Barracuda", "Bell", "Geico", "Ebate", "Ruby", "Forex", "Twitch", "Zurb"]

  has_many :documents
end
