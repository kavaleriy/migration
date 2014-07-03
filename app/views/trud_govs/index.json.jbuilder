json.array!(@trud_govs) do |trud_gov|
  json.extract! trud_gov, :id, :trud_code, :koatuu_code
  json.url trud_gov_url(trud_gov, format: :json)
end
