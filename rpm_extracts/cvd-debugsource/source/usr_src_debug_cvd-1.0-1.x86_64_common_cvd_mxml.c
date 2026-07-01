/*****************************************************************************
  Copyright (C) 2017 New H3C Technologies Inc.

         File: cvd_mxml.h
  Description: cvd_mxml.c header file
         Date: 2019-05-13
       Author: f18671

  History:
  Date        Name             Description
  --------------------------------------------------------------------------
  2019-05-13  f18671           migrate from cha
*****************************************************************************/
#ifdef  __cplusplus
extern "C"{
#endif
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<unistd.h>
#include<errno.h>
#include<mxml.h>
#include "clog.h"
#include "cvd_error.h"
#include "cvd_mxml.h"

/*****************************************************************************
*  Func Name : cvd_generate_xml
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : generate xml object;
*  Input : None
*  Output :
*        xml*:xml object
*  Return : success to generate xml object, return xml root node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_generate_xml(char **xml, const char *r_name)
{
    mxml_node_t* root = NULL;
    mxml_node_t **obj = (mxml_node_t **)xml;

    if (!obj || !r_name) {
        return NULL;
    }

    *obj = mxmlNewXML("1.0");
    root = mxmlNewElement(*obj, r_name);
    if (root) {
        return (char*)root;
    } else {
        mxmlDelete(*obj);
    }

    return NULL;
}

/*****************************************************************************
*  Func Name : cvd_string2xml
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : The string is converted to XML format;
*  Input :
*        data*: xml string
*  Output :
*        xml*: xml object
*  Return : success to convert XML format, return xml object, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_string2xml(const char *data, char **xml)
{
    mxml_node_t *root = NULL;
    mxml_node_t **obj = (mxml_node_t **)xml;

    if (!data || !obj) {
        return NULL;
    }

    *obj = mxmlLoadString(NULL, data, MXML_NO_CALLBACK);
    if (!*obj) {
        return NULL;
    }

    root = mxmlGetFirstChild(*obj);
    if (!root || MXML_ELEMENT != root->type) {
        mxmlDelete(*obj);
        *xml = NULL;
        return NULL;
    }

    return (char*)root;
}

/*****************************************************************************
*  Func Name : cvd_integer_string2xml
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : The string is converted to XML format;
*  Input :
*        data*: xml string
*  Output :
*        xml*: xml object
*  Return : success to convert XML format, return xml object, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_integer_string2xml(const char *data, char **xml)
{
    mxml_node_t *root = NULL;
    mxml_node_t **obj = (mxml_node_t **)xml;

    if (!data || !obj) {
        return NULL;
    }

    *obj = mxmlLoadString(NULL, data, MXML_INTEGER_CALLBACK);
    if (!*obj) {
        return NULL;
    }

    root = mxmlGetFirstChild(*obj);
    if (!root || MXML_ELEMENT != root->type) {
        mxmlDelete(*obj);
        return NULL;
    }

    return (char*)root;
}

/*****************************************************************************
*  Func Name : cvd_text_string2xml
*  Date Created: 2014-08-14
*  Author : jiayubo
*  Description : The string is converted to XML format, value opaque type;
*  Input :
*        data*: xml string
*  Output :
*        xml*: xml object
*  Return : success to convert XML format, return xml object, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_opaque_string2xml(const char *data, char **xml)
{
    mxml_node_t *root = NULL;
    mxml_node_t **obj = (mxml_node_t **)xml;

    if (!data || !obj) {
        return NULL;
    }

    *obj = mxmlLoadString(NULL, data, MXML_OPAQUE_CALLBACK);
    if (!*obj) {
        return NULL;
    }

    root = mxmlGetFirstChild(*obj);
    if (!root || MXML_ELEMENT != root->type) {
        mxmlDelete(*obj);
        return NULL;
    }

    return (char*)root;
}

/*****************************************************************************
*  Func Name : cvd_opaque_string2xml2
*  Date Created: 2014-08-14
*  Author : jiayubo
*  Description : The string is converted to XML format, value opaque type;
*  Input :
*        data*: xml string
*  Output :
*        xml*: xml object
*  Return : success to convert XML format, return xml object, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_opaque_string2xml2(const char *data, char **xml)
{
    mxml_node_t *root = NULL;
    mxml_node_t **obj = (mxml_node_t **)xml;

    if (!data || !obj) {
        return NULL;
    }

    *obj = mxmlNewXML("1.0");
    *obj = mxmlLoadString(*obj, data, MXML_OPAQUE_CALLBACK);
    if (!*obj) {
        return NULL;
    }

    root = mxmlGetFirstChild(*obj);
    if (!root || MXML_ELEMENT != root->type) {
        mxmlDelete(*obj);
        *obj = NULL;
        *xml = NULL;
        return NULL;
    }

    return (char*)root;
}

/*****************************************************************************
*  Func Name : cvd_new_xml_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : add new xml node to xml object;
*  Input :
*        node_name*:node name
*        node_value*:node value
*  Output : None
*  Return : success to add xml node, return new xml node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_new_xml_node(const char *node_name, const char *node_value)
{
    mxml_node_t* new_node = NULL;

    if (!node_name) {
        return NULL;
    }

    new_node = mxmlNewElement(NULL, node_name);
    if (!new_node) {
        return NULL;
    }

    if (node_value) {
        mxmlNewText(new_node, 0, node_value);
    }

    return (char*)new_node;
}

/*****************************************************************************
*  Func Name : cvd_add_node_to_parent
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : add new xml node to xml object;
*  Input :
*        node_name*:node name
*        node_value*:node value
*  Output : None
*  Return : success to add xml node, return new xml node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
void cvd_add_node_to_parent(const char *parent, const char *add_node)
{
    mxmlAdd((mxml_node_t*)parent, MXML_ADD_AFTER, NULL, (mxml_node_t*)add_node);
}

/*****************************************************************************
*  Func Name : cvd_add_xml_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : add new xml node to xml object;
*  Input :
*        parent*: parent node
*        node_name*:node name
*        node_value*:node value
*  Output : None
*  Return : success to add xml node, return new xml node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_add_xml_node(const char *parent, const char *node_name,
                                               const char *node_value)
{
    mxml_node_t* new_node = NULL;

    if ((!node_name) || (NULL == parent)) {
        return NULL;
    }

    new_node = mxmlNewElement(NULL, node_name);
    if (!new_node) {
        return NULL;
    }

    mxmlAdd((mxml_node_t*)parent, MXML_ADD_AFTER, NULL, new_node);

    if (node_value) {
        mxmlNewText(new_node, 0, node_value);
    }

    return (char*)new_node;
}

/*****************************************************************************
*  Func Name : cvd_add_xml_node_after
*  Date Created: 2014-08-14
*  Author : jiayubo
*  Description : add new xml node to xml object, after parent node;
*  Input :
*        parent*: parent node
*        node_name*:node name
*        node_value*:node value
*  Output : None
*  Return : success to add xml node, return new xml node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_add_xml_node_after(const char *parent, const char *node_name,
                                               const char *node_value)
{
    mxml_node_t* new_node = NULL;

    if ((!node_name) || (!parent)) {
        return NULL;
    }

    new_node = mxmlNewElement(NULL, node_name);
    if (!new_node) {
        return NULL;
    }

    mxmlAdd((mxml_node_t*)parent, MXML_ADD_AFTER, NULL, new_node);
    if (node_value) {
        mxmlNewText(new_node, 0, node_value);
    }

    return (char*)new_node;
}


/*****************************************************************************
*  Func Name : cvd_del_xml_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : delete xml node from xml object;
*  Input :
*        xml_node*: need to delete xml node
*  Output : None
*  Return : success to delete xml node, return cvd_success, else return other
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
int cvd_del_xml_node(const char *xml_node)
{
    if (!xml_node) {
        return CVD_EC_FAILURE;
    }

    mxmlDelete((mxml_node_t*)xml_node);

    return CVD_EC_OK;
}

/*****************************************************************************
*  Func Name : cvd_find_xml_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : find the specified xml node child of the current node;
*  Input :
*        xml_node*:current node
*        name*: node name or NULL for any
*        attr*:Attribute name, or NULL for none
*        value*:Attribute value, or NULL for any
*  Output : None
*  Return : success to find the specified node, return xml node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_find_xml_node(const char *xml_node, const char *name,
                        const char *attr, const char *value)
{
    return (char*)mxmlFindElement((mxml_node_t*)xml_node, (mxml_node_t*)xml_node, \
        name, attr, value, MXML_DESCEND_FIRST);
}

/*****************************************************************************
*  Func Name : cvd_depth_find_xml_node
*  Date Created: 2017-03-22
*  Author : zhangyibing
*  Description : find the specified xml node child of the current node;
*  Input :
*        node*:current node
*        top*: top node
*        name*: node name or NULL for any
*        attr*:Attribute name, or NULL for none
*        value*:Attribute value, or NULL for any
*  Output : None
*  Return : success to find the specified node, return xml node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_depth_find_xml_node(const char *node, const char *top, const char *name,
                              const char *attr, const char *value)
{
    return (char*)mxmlFindElement((mxml_node_t*)node, (mxml_node_t*)top, \
        name, attr, value, MXML_DESCEND);
}

/*****************************************************************************
*  Func Name : cvd_get_next_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get next xml node in the current node;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to get next node, return next node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_get_next_node(const char *xml_node)
{
    mxml_node_t *mnode = NULL;

    mnode = mxmlGetNextSibling((mxml_node_t *)xml_node);
    if (mnode && (1 == mnode->value.text.whitespace)) {
        mnode = mxmlGetNextSibling(mnode);
    }

    return (char *)mnode;
}

/*****************************************************************************
*  Func Name : cvd_get_pre_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get pre xml node in the current node;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to get pre node, return pre node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_get_pre_node(const char *xml_node)
{
    return (char*)mxmlGetPrevSibling((mxml_node_t*)xml_node);
}

/*****************************************************************************
*  Func Name : cha_get_firstchild_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get the firsh child in the current node;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to get child node, return child node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_get_firstchild_node(const char *xml_node)
{
    mxml_node_t *root = NULL;

    if (!xml_node) {
        return NULL;
    }

    root = mxmlGetFirstChild((mxml_node_t*)xml_node);
    if (!root || ((MXML_ELEMENT != root->type) && (MXML_TEXT != root->type))) {
        return NULL;
    }

    if (1 == root->value.text.whitespace) {
        root = mxmlGetNextSibling(root);
    }

    return (char *)root;
}

/*****************************************************************************
*  Func Name : cvd_get_lastchild_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get the last child in the current node;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to get child node, return child node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_get_lastchild_node(const char *xml_node)
{
    return (char*)mxmlGetLastChild((mxml_node_t*)xml_node);
}

/*****************************************************************************
*  Func Name : cvd_get_parent_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get parent node in the current node;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to get the parent node, return parent node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_get_parent_node(const char *xml_node)
{
    return (char*)mxmlGetParent((mxml_node_t*)xml_node);
}

/*****************************************************************************
*  Func Name : cvd_get_node_name
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get the current node name;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to node name, return the node name, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
const char* cvd_get_node_name(const char *xml_node)
{
    return mxmlGetElement((mxml_node_t*)xml_node);
}

/*****************************************************************************
*  Func Name : cvd_get_node_attr
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get specified node attribute value in the current node;
*  Input :
*        xml_node*:current node
*        attr_name*:name of attribute
*  Output : None
*  Return : success to get the node attribute value, return node attribute value, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
const char* cvd_get_node_attr(const char *xml_node, const char *attr_name)
{
    return mxmlElementGetAttr((mxml_node_t*)xml_node, attr_name);
}

/*****************************************************************************
*  Func Name : cvd_get_node_value
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get node value in the current node;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to get node value, return node value, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
const char* cvd_get_node_value(const char *xml_node)
{
    int res = 0;
    return mxmlGetText((mxml_node_t*)xml_node, &res);
}

/*****************************************************************************
*  Func Name : cvd_get_node_opaque_value
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get node value in the current node;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to get node value, return node value, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
const char* cvd_get_node_opaque_value(const char *xml_node)
{
    return mxmlGetOpaque((mxml_node_t*)xml_node);
}

/*****************************************************************************
*  Func Name : cvd_get_node_integer
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get node value in the current node;
*  Input :
*        xml_node*:current node
*  Output : None
*  Return : success to get node value, return node value, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
int cvd_get_node_integer(const char *xml_node)
{
    if (!xml_node){
        return -1;
    }

    return mxmlGetInteger((mxml_node_t*)xml_node);
}

/*****************************************************************************
*  Func Name : cvd_set_node_value
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : get node value in the current node;
*  Input :
*        xml_node*:current node
*        value*:node value
*  Output : None
*  Return : success to set node value, return node, else return NULL
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
char* cvd_set_node_value(const char *xml_node, const char *value)
{
    if (!xml_node || !value) {
        return NULL;
    }

    return (char*)mxmlNewText((mxml_node_t*)xml_node, 0, value);
}

/*****************************************************************************
*  Func Name : cvd_set_node_attr
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : set specified node attribute value in the current node;
*  Input :
*        xml_node*:current node
*        attr_name*:name of attribute
*        attr_value*:attribute value
*  Output : None
*  Return : success to set specified node attribute value, return cha_success, else return other
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
int cvd_set_node_attr(const char *xml_node, const char *attr_name, const char *attr_value)
{
    if (!xml_node || !attr_name || !attr_value) {
        return CVD_EC_FAILURE;
    }

    mxmlElementSetAttr((mxml_node_t*)xml_node, attr_name, attr_value);

    return CVD_EC_OK;
}

/*****************************************************************************
*  Func Name : cvd_remove_xml_node
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : save the XML to the specified file;
*  Input :
*        xml_node*:xml node
*  Output : None
*  Return : None
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
void cvd_remove_xml_node(const char *xml_node)
{
    mxmlRemove((mxml_node_t*)xml_node);
}

/*****************************************************************************
*  Func Name : cvd_save_xml
*  Date Created: 2014-07-06
*  Author : zhangyibing
*  Description : save the XML to the specified file;
*  Input :
*        xml*:xml object
*        file*:file name
*  Output : None
*  Return : success to save the xml, return cha_success, else return other
*  Caution :
*-----------------------------------------------------------------------------
*  Modification History
*  DATE        NAME             DESCRIPTION
*-----------------------------------------------------------------------------
******************************************************************************/
int cvd_save_xml(const char *xml, const char *file)
{
    mxml_node_t* obj = (mxml_node_t*)xml;
    FILE *fp = NULL;
    int res = 0;

    if (!obj || !file) {
        return CVD_EC_FAILURE;
    }

    fp = fopen(file, "w");
    if (fp) {
        res = mxmlSaveFile(obj, fp, MXML_NO_CALLBACK);
        if (0 == res) {
            fclose(fp);
            return CVD_EC_OK;
        }

        fclose(fp);
    }

    return CVD_EC_FAILURE;
}

/*****************************************************************************
    Func Name: cvd_load_xml_from_file
 Date Created: 2015/1/29
       Author: wangyongqing 01206
  Description: load xml string from file
        Input: const char *file  file name
       Output:
       Return: xml message
      Caution:
------------------------------------------------------------------------------
  Modification History
  DATE        NAME             DESCRIPTION
  --------------------------------------------------------------------------

*****************************************************************************/
char *cvd_load_xml_from_file(const char *file)
{
    mxml_node_t *obj = NULL;
    FILE *fp = NULL;

    if (NULL == file) {
        return NULL;
    }

    fp = fopen(file, "r");
    if (!fp) {
        clog_err("failed to open %s, result:%s", file, strerror(errno));
        return NULL;
    }

    obj = mxmlLoadFile(NULL, fp, MXML_OPAQUE_CALLBACK);
    if (!obj) {
        fclose(fp);
        clog_err("mxmlLoadFile %s error", file);
        return NULL;
    }

    fclose(fp);

    return (char *)obj;
}

#ifdef  __cplusplus
}
#endif

