# createTestMountParameters

This is a helper function for vue testing. It returns fresh `MockParameters`, including a `localVue`, `vuetify`, and `vuex` instance, the latter copying the basic `core` store structure, i.e., having an empty namespaced `plugin` module.  
This is mostly done to avoid boilerplate code. For regularly used test contents, feel free to extend the returned contents.
