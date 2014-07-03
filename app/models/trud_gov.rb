class TrudGov < ActiveRecord::Base
  default_scope -> { order('koatuu_code') }

  def self.filter_by_koatuu(code)
    self.where("koatuu_code like ?", "#{code}%")
  end
end
