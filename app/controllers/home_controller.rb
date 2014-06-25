class HomeController < ApplicationController
  def index
    @area = Koatuu.areas_to_json.collect { |area| [ area[:name], area[:id] ] }
    @type = Type.all.collect { |i| [ i.name, i.id.to_s ] }
  end

  def search
    # binding.pry

    @housings = Housing.all.collect

    respond_to do |format|
      format.js
    end
  end

end
