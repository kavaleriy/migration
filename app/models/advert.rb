class Advert < ActiveRecord::Base
  belongs_to :housing
  belongs_to :house

  scope :users_adverts, lambda { |email| where(email: email).order(:created_at => :desc)}

  validates_presence_of  :qty_places, :message => "- повинна мати значення"
  validates_presence_of  :phone, :message => "- повинна мати значення"


  def self.group_qtt code
    where("koatuu_code like ?", "#{code}%").sum('qty_places')
  end

end
