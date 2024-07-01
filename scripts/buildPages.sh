array=( afm generic meldemichel snowbox textLocator )
for i in "${array[@]}"
do
  echo "Building $i docs ..."
	npm run docs:$i
  mkdir --parents ./pages/docs/$i
  mv ./packages/clients/$i/docs/* ./pages/docs/$i
done
echo "All docs built."
echo "GitHub page built."
