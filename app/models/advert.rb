class Advert < ActiveRecord::Base
  belongs_to :housing
  belongs_to :house

  has_one :advert_work, dependent: :destroy

  scope :users_adverts, lambda { |email| where(email: email).order(:created_at => :desc)}

  validates_presence_of  :qty_places, :message => I18n.t('errors.messages.empty')
  validates_presence_of  :phone, :message => I18n.t('errors.messages.empty')


  def self.group_qtt code
    where("koatuu_code like ?", "#{code}%").sum('qty_places')
  end

end
