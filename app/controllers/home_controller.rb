class HomeController < ApplicationController
  def index
    @koatuu = Koatuu.get_tree('')
    @type = (Type.all.collect { |i| [ i.name, i.id.to_s ] })
  end
end
