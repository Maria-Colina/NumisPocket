local function has_mermaid_class(classes)
  for _, class_name in ipairs(classes) do
    if class_name == "mermaid" then
      return true
    end
  end
  return false
end

function CodeBlock(block)
  if not has_mermaid_class(block.classes) then
    return nil
  end

  local caption_text = block.attributes["caption"] or "Diagrama Mermaid"

  local caption_inlines = nil
  local caption_doc = pandoc.read(caption_text, "markdown")
  if #caption_doc.blocks > 0 and caption_doc.blocks[1].t == "Para" then
    caption_inlines = caption_doc.blocks[1].content
  else
    caption_inlines = { pandoc.Str(caption_text) }
  end

  local output_dir = "images/mermaid"
  os.execute('mkdir -p "' .. output_dir .. '"')

  local digest = pandoc.sha1(block.text)
  local input_file = output_dir .. "/" .. digest .. ".mmd"
  local output_file = output_dir .. "/" .. digest .. ".png"

  local handle = io.open(input_file, "w")
  if not handle then
    return block
  end
  handle:write(block.text)
  handle:close()

  local command =
    'npx -y @mermaid-js/mermaid-cli -i "' ..
    input_file ..
    '" -o "' ..
    output_file ..
    '" -b transparent'

  local ok = os.execute(command)
  if ok == true or ok == 0 then
    local image = pandoc.Image(caption_inlines, output_file)
    local caption = pandoc.Caption({ pandoc.Plain(caption_inlines) })
    return pandoc.Figure({ pandoc.Plain({ image }) }, caption)
  end

  return block
end
