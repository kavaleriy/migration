class WelcomeController < ApplicationController
  def index
    @area_list = Area.all.map { |area| [area.name, area.id] }
  end

  def map_os
  end

  def map_ua
  end
end
