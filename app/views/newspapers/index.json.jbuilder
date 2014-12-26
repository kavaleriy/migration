json.array!(@newspapers) do |newspaper|
  json.extract! newspaper, :id, :embed
  json.url newspaper_url(newspaper, format: :json)
end
