class AdvertWork < ActiveRecord::Base
  belongs_to :advert
  accepts_nested_attributes_for :advert

  belongs_to :profession

  scope :users_adverts, lambda { |email| where("places" => email).order(:created_at => :desc)}

  validates_presence_of  :places, :message => I18n.t('errors.messages.empty')
  validates_presence_of  :profession, :message => I18n.t('errors.messages.empty')

  def self.group_qtt code
    includes(:advert).references(:advert).where("koatuu_code like ?", "#{code}%").sum('places')
  end

end

