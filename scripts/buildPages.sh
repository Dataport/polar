array=( afm generic meldemichel snowbox textLocator )
for i in "${array[@]}"
do
  echo "Building $i docs ..."
	npm run docs:$i
  if [[ "$OSTYPE" == "darwin"* ]]; then
    mkdir -p ./pages/docs/$i
  else
    mkdir --parents ./pages/docs/$i
  fi
  mv ./packages/clients/$i/docs/* ./pages/docs/$i
done
echo "All docs built."
echo "GitHub page built."
