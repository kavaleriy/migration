class Advert < ActiveRecord::Base
  belongs_to :housing
  belongs_to :house

  scope :users_adverts, lambda { |email| where(email: email).order(:created_at => :desc)}

  validates_presence_of  :qty_places, :message => "повинна мати значення"

end
