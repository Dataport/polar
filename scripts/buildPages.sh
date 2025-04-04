array=( afm diplan generic meldemichel snowbox textLocator )
for i in "${array[@]}"
do
  echo "Building $i docs ..."
	npm run docs:$i
  mkdir -p ./pages/docs/$i
  mv -f ./packages/clients/$i/docs/* ./pages/docs/$i
done
mkdir -p ./pages/node_modules/@polar/client-generic/dist
mv -f ./node_modules/@polar/client-generic/dist/* ./pages/node_modules/@polar/client-generic/dist
echo "All docs built."
echo "GitHub page built."
